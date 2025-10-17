import os
import subprocess
import requests
from openai import OpenAI

client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))

repo = os.getenv("REPO")
pr_number = os.getenv("PR_NUMBER")
github_token = os.getenv("GITHUB_TOKEN")

# Detect base branch (e.g., master or main)
base_ref = subprocess.getoutput("git remote show origin | grep 'HEAD branch' | awk '{print $NF}'")
if not base_ref:
    base_ref = "main"  # default fallback

cmd = f"git fetch origin {base_ref} && git diff origin/{base_ref}...HEAD"
diff = subprocess.getoutput(cmd)

if not diff.strip():
    print("No code changes detected.")
    exit(0)

prompt = f"""
You are a senior full-stack engineer performing a GitHub pull request code review.
For each changed file and line in the diff below, provide targeted inline feedback.

Respond in JSON with this structure:
[
  {{
    "file": "src/example.js",
    "line": 42,
    "comment": "Suggestion or issue description"
  }},
  ...
]

Git Diff:
{diff}
"""

response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[{"role": "user", "content": prompt}],
    temperature=0.3,
)

try:
    import json
    comments = json.loads(response.choices[0].message.content)
except Exception:
    print("Could not parse AI response as JSON.")
    print(response.choices[0].message.content)
    exit(1)

# Post comments to GitHub
headers = {"Authorization": f"Bearer {github_token}"}
for c in comments:
    url = f"https://api.github.com/repos/{repo}/pulls/{pr_number}/comments"
    payload = {
        "body": c["comment"],
        "path": c["file"],
        "line": c["line"],
        "side": "RIGHT"
    }
    r = requests.post(url, headers=headers, json=payload)
    if r.status_code not in [200, 201]:
        print(f"❌ Failed to post comment: {r.status_code} - {r.text}")
    else:
        print(f"💬 Comment added on {c['file']} line {c['line']}")