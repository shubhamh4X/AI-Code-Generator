from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import openai
import subprocess

app = FastAPI()

# Replace with your OpenAI API Key
OPENAI_API_KEY = "your_openai_api_key"

class CodeRequest(BaseModel):
    prompt: str
    language: str
    run_code: bool = False  # Flag to execute code

@app.post("/generate-code/")
async def generate_code(request: CodeRequest):
    try:
        response = openai.ChatCompletion.create(
            model="gpt-4",
            messages=[{"role": "user", "content": f"Generate {request.language} code for: {request.prompt}"}]
        )
        code = response["choices"][0]["message"]["content"]

        if request.run_code:
            output = execute_code(code, request.language)
            return {"code": code, "output": output}
        
        return {"code": code}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def execute_code(code: str, language: str):
    temp_file = f"temp_code.{language.lower()}"
    with open(temp_file, "w") as file:
        file.write(code)
    
    try:
        if language == "Python":
            result = subprocess.run(["python", temp_file], capture_output=True, text=True, timeout=5)
        elif language == "JavaScript":
            result = subprocess.run(["node", temp_file], capture_output=True, text=True, timeout=5)
        elif language == "Java":
            result = subprocess.run(["javac", temp_file], capture_output=True, text=True, timeout=5)
        else:
            return "Unsupported language execution"

        return result.stdout if result.stdout else result.stderr
    
    except Exception as e:
        return f"Error: {str(e)}"
