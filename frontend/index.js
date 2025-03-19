import { useState } from "react";
import MonacoEditor from "@monaco-editor/react";
import axios from "axios";

export default function CodeGenerator() {
  const [prompt, setPrompt] = useState("");
  const [language, setLanguage] = useState("Python");
  const [code, setCode] = useState("");
  const [output, setOutput] = useState("");

  const generateCode = async () => {
    try {
      const response = await axios.post("http://localhost:8000/generate-code/", {
        prompt,
        language,
        run_code: false,
      });
      setCode(response.data.code);
    } catch (error) {
      console.error("Error generating code:", error);
    }
  };

  const runCode = async () => {
    try {
      const response = await axios.post("http://localhost:8000/generate-code/", {
        prompt,
        language,
        run_code: true,
      });
      setOutput(response.data.output);
    } catch (error) {
      console.error("Error running code:", error);
    }
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold">⚡ AI Code Generator</h1>
      <input
        type="text"
        className="p-2 my-2 w-full bg-gray-800 text-white"
        placeholder="Enter your prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />
      <select className="p-2 bg-gray-700" value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option>Python</option>
        <option>JavaScript</option>
        <option>Java</option>
      </select>
      <button className="p-2 bg-blue-500 mt-2" onClick={generateCode}>Generate</button>
      <MonacoEditor height="300px" language={language.toLowerCase()} value={code} theme="vs-dark" />
      <button className="p-2 bg-green-500 mt-2" onClick={runCode}>Run Code</button>
      <pre className="bg-gray-800 p-4 mt-2">{output}</pre>
    </div>
  );
}
