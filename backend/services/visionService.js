import fetch from "node-fetch";

const SYSTEM_PROMPT =
  "You are a kitchen assistant. Analyze this image and list ALL visible food ingredients. Return a JSON array of ingredient names only. Be thorough - include spices, vegetables, dairy, proteins, condiments.";

function getVisionConfig() {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;
  const deployment =
    process.env.AZURE_OPENAI_VISION_DEPLOYMENT ||
    process.env.AZURE_OPENAI_DEPLOYMENT ||
    "gpt-5.4-nano";
  const apiVersion = process.env.AZURE_OPENAI_API_VERSION || "2025-01-01-preview";

  if (!endpoint || !apiKey) {
    throw new Error("Azure OpenAI vision is not configured.");
  }

  return {
    endpoint: endpoint.replace(/\/$/, ""),
    apiKey,
    deployment,
    apiVersion,
  };
}

function parseIngredients(content) {
  const cleaned = content
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();

  const parsed = JSON.parse(cleaned);
  const ingredients = Array.isArray(parsed)
    ? parsed
    : parsed.ingredients || parsed.items || [];

  if (!Array.isArray(ingredients)) {
    throw new Error("Vision model returned an unexpected response shape.");
  }

  return [
    ...new Set(
      ingredients
        .filter((item) => typeof item === "string")
        .map((item) => item.trim().toLowerCase())
        .filter(Boolean)
    ),
  ];
}

export async function extractIngredientsFromImage(imageBuffer, mimeType) {
  try {
    const { endpoint, apiKey, deployment, apiVersion } = getVisionConfig();
    const imageUrl = `data:${mimeType};base64,${imageBuffer.toString("base64")}`;

    const response = await fetch(
      `${endpoint}/openai/deployments/${deployment}/chat/completions?api-version=${apiVersion}`,
      {
        method: "POST",
        headers: {
          "api-key": apiKey,
          "content-type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            { role: "system", content: SYSTEM_PROMPT },
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: "Identify all visible food ingredients in this image.",
                },
                {
                  type: "image_url",
                  image_url: { url: imageUrl },
                },
              ],
            },
          ],
          temperature: 0.1,
          max_tokens: 700,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Azure OpenAI vision request failed.");
    }

    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("Azure OpenAI vision response was empty.");
    }

    return parseIngredients(content);
  } catch (error) {
    console.error("extractIngredientsFromImage failed:", error);
    throw error;
  }
}
