import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";
import { AzureKeyCredential } from "@azure/core-auth";

function parseRecipeResponse(outputText) {
  const cleanedText = outputText
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  // Try direct JSON parse first
  try {
    const parsed = JSON.parse(cleanedText);
    return Array.isArray(parsed) ? { recipes: parsed } : parsed;
  } catch (e) {
    // Attempt to extract JSON object/array from the text
    const jsonMatch = cleanedText.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[1]);
        return Array.isArray(parsed) ? { recipes: parsed } : parsed;
      } catch (e2) {
        // fall through
      }
    }

    // As a last resort, return the raw text wrapped in an object so responses are always JSON
    return { text: cleanedText };
  }
}

export async function getRecipesFromAgent(
  ingredients,
  preferences
) {
  try {
    const projectEndpoint =
      process.env.AZURE_AI_PROJECT_ENDPOINT || process.env.PROJECT_ENDPOINT;

    if (!projectEndpoint) {
      throw new Error(
        "AZURE_AI_PROJECT_ENDPOINT (or PROJECT_ENDPOINT) is not configured."
      );
    }

    // Prepare agent identifiers and prompt before choosing auth method
    const agentName = process.env.AGENT_NAME || process.env.AGENT || "chefmate-ai-agent";
    const agentVersion = process.env.AGENT_VERSION || undefined;

    const prompt = `
Ingredients:
${ingredients.join(", ")}

Preferences:
${JSON.stringify(preferences, null, 2)}

Rules:
- Filter by dietary mode strictly. For veg, never include meat, fish, poultry, gelatin, or eggs.
- For eggetarian, eggs are allowed but meat, fish, and poultry are not.
- If leftoverMinimizer is true, rank recipes by matching ingredients divided by total ingredients.
- Apply the nutritional goal when possible. Weight loss recipes should be under 400 calories.
- Use grounded recipe knowledge and include the source or citation returned by Foundry IQ.

Return only valid JSON in this shape:
{
  "recipes": [
    {
      "id": "string",
      "name": "string",
      "cuisine": "string",
      "timeMinutes": number,
      "diet": "veg|non-veg|eggetarian",
      "matchScore": number,
      "availableIngredients": ["string"],
      "missingIngredients": ["string"],
      "steps": ["string"],
      "nutrition": {
        "calories": number,
        "protein": "string",
        "carbs": "string"
      },
      "citation": "string",
      "tags": ["string"]
    }
  ]
}
`;

    // Prefer DefaultAzureCredential, but fall back to API key if provided
    const apiKey = process.env.AZURE_OPENAI_API_KEY || process.env.AZURE_API_KEY;

    // If an API key is provided, use a direct REST fallback to the project's /responses
    // endpoint instead of the SDK client, which can require additional header config.
    if (apiKey) {
      const apiVersion = "2025-05-15-preview";

      const url =
        `${projectEndpoint.replace(/\/$/, "")}/responses?api-version=${apiVersion}`;

      console.log("Project Endpoint:", projectEndpoint);
      console.log("Agent Name:", agentName);
      console.log("Using API Key:", !!apiKey);
      console.log("Calling URL:", url);
      

      const payload = {
        items: [
          {
            type: "message",
            role: "user",
            content: prompt,
          },
        ],
        agent: {
          name: agentName,
        },
      };

      // Send the API key using multiple common header names to accommodate different services
      const headers = {
        "Content-Type": "application/json",
        "api-key": apiKey,
        "x-api-key": apiKey,
        "azure-api-key": apiKey,
        "x-ms-api-key": apiKey,
        Authorization: `Bearer ${apiKey}`,
      };


      let res;
      try {
        res = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });
      } catch (netErr) {
        const message = `Network request to ${url} failed: ${netErr.message}`;
        const err = new Error(message);
        err.details = netErr;
        throw err;
      }

      const text = await res.text();

      if (!res.ok) {
        // Try to parse JSON error, else throw text
        try {
          const err = JSON.parse(text);
          throw new Error(err.error || JSON.stringify(err));
        } catch (e) {
          throw new Error(text || `Request failed with status ${res.status}`);
        }
      }

      // Try to parse response JSON and extract output_text
      let json;
      try {
        json = JSON.parse(text);
      } catch (e) {
        // If response is plain text, pass through
        return parseRecipeResponse(text);
      }

      const outputText =
        json.output_text ||
        (json.output && Array.isArray(json.output)
          ? json.output.map((o) => o.text || "").join("")
          : null) ||
        JSON.stringify(json);

      if (!json.output_text && json && Object.keys(json).length > 0) {
        console.warn("Response did not include `output_text`; using best-effort text.");
      }

      return parseRecipeResponse(outputText);
    }

    // No API key, use SDK with DefaultAzureCredential
    const credential = new DefaultAzureCredential();
    const project = new AIProjectClient(projectEndpoint, credential);

    const openAIClient = project.getOpenAIClient();
    const conversation = await openAIClient.conversations.create({
      items: [
        {
          type: "message",
          role: "user",
          content: prompt,
        },
      ],
    });

    const body = {
      agent: {
        name: agentName,
        type: "agent_reference",
      },
    };

    if (agentVersion) {
      body.agent.version = agentVersion;
    }

    const result = await openAIClient.responses.create(
      { conversation: conversation.id },
      { body }
    );

    // Clean up conversation if possible
    try {
      await openAIClient.conversations.delete(conversation.id);
    } catch (delErr) {
      console.warn("Failed to delete conversation:", delErr?.message || delErr);
    }

    // Prefer output_text, otherwise collate output array or stringify result for parsing
    const sdkOutputText =
      result.output_text ||
      (result.output && Array.isArray(result.output)
        ? result.output.map((o) => o.text || "").join("")
        : null) ||
      JSON.stringify(result);

    if (!result.output_text) {
      console.warn("SDK response missing `output_text`; using fallback stringified result.");
    }

    return parseRecipeResponse(sdkOutputText);
  } catch (error) {
    // Prefix with context so callers see where the error originated
    error.message = `getRecipesFromAgent: ${error.message}`;
    console.error(error);

    // Improve error message for common credential issues
    if (error.message && error.message.includes("CredentialUnavailableError")) {
      const keyHint = process.env.AZURE_OPENAI_API_KEY
        ? "Using AZURE_OPENAI_API_KEY is available; ensure it's correct and try again."
        : "If you have an API key, set AZURE_OPENAI_API_KEY in your .env to use key-based auth.";

      const authErr = new Error(
        `Authentication to Azure failed. Ensure AZURE_AI_PROJECT_ENDPOINT is set and you are authenticated (run \`az login\`) or provide proper credentials. ${keyHint} Original: ${error.message}`
      );
      authErr.details = error;
      throw authErr;
    }

    throw error;
  }
}
