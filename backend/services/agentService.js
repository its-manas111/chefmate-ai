import { execFile } from "child_process";
import { promisify } from "util";
import path from "path";

const execFileAsync = promisify(execFile);

export async function getRecipesFromAgent(
  ingredients,
  preferences
) {
  try {
    const payload = JSON.stringify({
      ingredients,
      preferences,
    });

    const scriptPath = path.join(
      process.cwd(),
      "agent_wrapper.py"
    );

    const { stdout, stderr } = await execFileAsync(
      "python",
      [scriptPath, payload],
      {
        maxBuffer: 1024 * 1024 * 10,
      }
    );

    if (stderr?.trim()) {
      console.warn("Python stderr:", stderr);
    }

    const output = stdout.trim();

    if (!output) {
      throw new Error(
        "No output returned from agent_wrapper.py"
      );
    }

    let result;

    try {
      result = JSON.parse(output);
    } catch (parseError) {
      console.error("Raw Python Output:");
      console.error(output);

      throw new Error(
        "Invalid JSON returned from agent_wrapper.py"
      );
    }

    if (result.error) {
      throw new Error(result.error);
    }

    return result;
  } catch (error) {
    console.error(
      "Agent Service Error:",
      error
    );

    throw new Error(
      `getRecipesFromAgent: ${error.message}`
    );
  }
}