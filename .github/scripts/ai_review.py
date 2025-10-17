import os
import subprocess
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

# Get the diff between main and the PR branch
diff = subprocess.getoutput("git fetch origin master && git diff origin/master...HEAD")

print(diff)

if not diff.strip():
    print("No changes detected.")
    exit(0)

prompt = f"""
You are a senior full stack engineer reviewing a GitHub Pull Request for a JavaScript/TypeScript project using React and Node.js.

Please analyze the diff below and provide:
1. **Code quality observations**
2. **Potential bugs or logic issues**
3. **Security or performance concerns**
4. **Suggestions for improvement**
5. **Overall summary (short and actionable)**

Git Diff:
{diff}
"""

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are an expert code reviewer who provides concise, technical, and actionable feedback."},
        {"role": "user", "content": prompt}
    ],
    temperature=0.3,
)

print(response.choices[0].message.content)