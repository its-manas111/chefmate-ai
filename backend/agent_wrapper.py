import asyncio
import json
import os
import sys
from dotenv import load_dotenv

from agent_framework_foundry import FoundryAgent
from azure.identity.aio import DefaultAzureCredential

load_dotenv()


async def run_agent(payload: str):
    async with FoundryAgent(
        project_endpoint=os.environ["AZURE_AI_PROJECT_ENDPOINT"],
        agent_name="chefmate-ai-agent",
        agent_version="3",
        credential=DefaultAzureCredential(),
    ) as agent:

        response_text = ""

        async for chunk in agent.run(payload, stream=True):
            if chunk.text:
                response_text += chunk.text

        return response_text


async def main():
    try:
        if len(sys.argv) < 2:
            print(
                json.dumps(
                    {
                        "error": "Missing payload argument"
                    }
                )
            )
            return

        payload = sys.argv[1]

        result = await run_agent(payload)

        # Try returning parsed JSON
        try:
            parsed = json.loads(result)
            print(json.dumps(parsed))
        except Exception:
            print(
                json.dumps(
                    {
                        "rawResponse": result
                    }
                )
            )

    except Exception as e:
        print(
            json.dumps(
                {
                    "error": str(e)
                }
            )
        )


if __name__ == "__main__":
    asyncio.run(main())