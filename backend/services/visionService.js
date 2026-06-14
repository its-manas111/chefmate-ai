import fetch from "node-fetch";

const SYSTEM_PROMPT =
  "You are a kitchen assistant. Analyze this image and list ALL visible food ingredients. Return a JSON array of ingredient names only. Be thorough and include vegetables, fruits, dairy, proteins, grains, spices, condiments, and packaged food items when visible.";

function getVisionConfig() {
  const endpoint = process.env.AZURE_OPENAI_ENDPOINT;
  const apiKey = process.env.AZURE_OPENAI_API_KEY;

  const deployment =
    process.env.AZURE_OPENAI_VISION_DEPLOYMENT ||
    process.env.AZURE_OPENAI_DEPLOYMENT ||
    "gpt-5.4-nano";

  const apiVersion =
    process.env.AZURE_OPENAI_API_VERSION ||
    "2025-01-01-preview";

  if (!endpoint || !apiKey) {
    throw new Error(
      "AZURE_OPENAI_ENDPOINT or AZURE_OPENAI_API_KEY is missing."
    );
  }

  return {
    endpoint,
    apiKey,
    deployment,
    apiVersion,
  };
}

function parseIngredients(content) {
  try {
    const cleaned = content
      .replace(/^```json/i, "")
      .replace(/^```/i, "")
      .replace(/```$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    const ingredients = Array.isArray(parsed)
      ? parsed
      : parsed.ingredients || parsed.items || [];

    return [
      ...new Set(
        ingredients
          .filter((item) => typeof item === "string")
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean)
      ),
    ];
  } catch (error) {
    console.error("Failed to parse ingredient response:", error);

    return [];
  }
}

export async function extractIngredientsFromImage(
  imageBuffer,
  mimeType
) {
  try {
    const {
      endpoint,
      apiKey,
      deployment,
      apiVersion,
    } = getVisionConfig();

    // Handle both:
    // https://xxx.openai.azure.com
    // https://xxx.openai.azure.com/openai/v1
    const baseEndpoint = endpoint
      .replace(/\/openai\/v1$/i, "")
      .replace(/\/$/, "");

    const url =
      `${baseEndpoint}/openai/deployments/${deployment}` +
      `/chat/completions?api-version=${apiVersion}`;

    console.log("Vision URL:", url);

    const imageUrl =
      `data:${mimeType};base64,${imageBuffer.toString("base64")}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Identify every visible food ingredient in this image and return only a JSON array.",
              },
              {
                type: "image_url",
                image_url: {
                  url: imageUrl,
                },
              },
            ],
          },
        ],
        temperature: 0.1,
        max_completion_tokens: 700,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Azure Vision Error:", data);

      throw new Error(
        data?.error?.message ||
          `Azure request failed (${response.status})`
      );
    }

    const content =
      data?.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error(
        "No content returned from vision model."
      );
    }

    return parseIngredients(content);
  } catch (error) {
    console.error(
      "extractIngredientsFromImage failed:",
      error
    );
    throw error;
  }
}