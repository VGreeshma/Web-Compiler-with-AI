from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import subprocess
import tempfile
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

OPENROUTER_API_KEY = os.getenv("OPENROUTER_API_KEY")

HEADERS = {
    "Authorization": f"Bearer {OPENROUTER_API_KEY}",
    "Content-Type": "application/json"
}

@app.route("/run", methods=["POST"])
def run_code():
    data = request.json
    language = data["language"]
    code = data["code"]

    filename = None
    exe_file = None

    try:
        suffix = ".c" if language == "c" else ".cpp"

        with tempfile.NamedTemporaryFile(delete=False, suffix=suffix, mode="w") as f:
            f.write(code)
            filename = f.name

        exe_file = filename + ".exe"   # IMPORTANT for Windows

        if language == "c":
            compile_cmd = ["gcc", filename, "-o", exe_file]
        else:
            compile_cmd = ["g++", filename, "-o", exe_file]

        compile_process = subprocess.run(
            compile_cmd, capture_output=True, text=True
        )

        if compile_process.stderr:
            return jsonify({"error": compile_process.stderr})

        run_process = subprocess.run(
            exe_file, capture_output=True, text=True, shell=True
        )

        return jsonify({"output": run_process.stdout})

    except Exception as e:
        return jsonify({"error": str(e)})

    finally:
        if filename and os.path.exists(filename):
            os.remove(filename)
        if exe_file and os.path.exists(exe_file):
            os.remove(exe_file)


@app.route("/fix", methods=["POST"])
def fix_code():
    data = request.json
    code = data["code"]
    error = data["error"]
    mode = data["mode"]

    prompt = f"""
Fix the following code and explain it:

Code:
{code}

Error:
{error}
"""

    payload = {
        "model": "openai/gpt-oss-20b:free",
        "messages": [
            {"role": "user", "content": prompt}
        ]
    }

    response = requests.post(
        "https://openrouter.ai/api/v1/chat/completions",
        headers=HEADERS,
        json=payload
    )

    result = response.json()

    if "choices" not in result:
        return jsonify({"error": result})

    ai_text = result["choices"][0]["message"]["content"]

    return jsonify({"ai": ai_text})


if __name__ == "__main__":
    app.run(port=5000, debug=True)