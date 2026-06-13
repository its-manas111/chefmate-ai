import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

function parseRecipeResponse(outputText) {
  const cleanedText = outputText
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  const parsed = JSON.parse(cleanedText);

  return Array.isArray(parsed)
    ? { recipes: parsed }
    : parsed;
}

export async function getRecipesFromAgent(
  ingredients,
  preferences
) {
  try {
    const project = new AIProjectClient(
      process.env.PROJECT_ENDPOINT,
      new DefaultAzureCredential()
    );

    const agentName = process.env.AGENT_NAME;

    if (!agentName) {
      throw new Error("AGENT_NAME is not configured.");
    }

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

    const result = await openAIClient.responses.create(
      {
        conversation: conversation.id,
      },
      {
        body: {
          agent: {
            name: agentName,
            type: "agent_reference",
          },
        },
      }
    );

    await openAIClient.conversations.delete(conversation.id);

    return parseRecipeResponse(result.output_text);
  } catch (error) {
    console.error(error);
    throw error;
  }
}
