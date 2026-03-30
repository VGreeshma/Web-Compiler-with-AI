import React, { useRef, useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { useLocation } from "react-router-dom";

const files = {
  "script.c": {
    name: "script.c",
    language: "c",
    value: `#include <stdio.h>

int main(){  
    printf("Hello World\n");
    return 0;
}`
  },
  "script.cpp": {
    name: "script.cpp",
    language: "cpp",
    value: `#include <iostream>
using namespace std;

int main(){
    cout << "Hello World" << endl;
    return 0;
}`
  }
};

function Monaco() {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const lang = query.get("lang") || "c";

  const [fileName, setFileName] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [explanation, setExplanation] = useState("");

  const editorRef = useRef(null);

  useEffect(() => {
    setFileName(lang === "c" ? "script.c" : "script.cpp");
  }, [lang]);

  const file = files[fileName];

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  // ---------------- RUN CODE ----------------
  const handleRun = async () => {
    const code = editorRef.current.getValue();
    setOutput("⏳ Running...");
    setError("");
    setExplanation("");

    try {
      const response = await fetch("http://localhost:5000/run", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ language: file.language, code })
      });

      const result = await response.json();

      if (result.error) {
        setError(result.error);
        setOutput("");
      } else {
        setOutput(result.output || "No Output");
      }
    } catch (err) {
      setError("Backend server not running!");
      setOutput("");
    }
  };

  // ---------------- SAVE FILE ----------------
  const handleSave = () => {
    if (!editorRef.current) return;

    const code = editorRef.current.getValue();

    const blob = new Blob([code], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);

    const fileName = file.language === "c" ? "program.c" : "program.cpp";
    a.download = fileName;

    a.click();
  };

  // ---------------- FIX IT ----------------
  const handleFixIt = () => {
    window.open(
      "https://openrouter.ai/chat?model=openai/gpt-3.5-turbo",
      "_blank"
    );
  };

  // ---------------- EXPLANATION ----------------
  const handleExplanation = () => {
    let msg = "";

    if (error.includes("stdio")) {
      msg = "You forgot to include <stdio.h> for printf.";
    } else if (error.includes("cout")) {
      msg = "You must include <iostream> and use namespace std for cout.";
    } else if (error.includes("semicolon")) {
      msg = "You forgot a semicolon at the end of a statement.";
    } else if (error.includes("main")) {
      msg = "Your program must have a valid main() function.";
    } else {
      msg =
        "There is a syntax or logical error. Check brackets, headers, and semicolons.";
    }

    setExplanation(msg);
  };

  const handleExit = () => {
    setError("");
    setExplanation("");
  };

  if (!file) return null;

  return (
    <div style={{ padding: "10px" }}>
      <h3 style={{ textAlign: "center" }}>
        {file.language === "c" ? "C" : "C++"} Compiler
      </h3>

      <button className="btn btn-success mb-2" onClick={handleRun}>
        ▶ Run
      </button>

      {/* MAIN LAYOUT */}
      <div style={{ display: "flex", height: "80vh" }}>
        
        {/* LEFT: Editor */}
        <div style={{ flex: 1, borderRight: "2px solid gray" }}>
          <Editor
            key={file.name}
            height="100%"
            theme="vs-dark"
            onMount={handleEditorDidMount}
            path={file.name}
            language={file.language}
            value={file.value}
          />
        </div>

        {/* RIGHT: Output Panel */}
        <div style={{ flex: 1, padding: "15px", background: "white" }}>
          <h5>Output</h5>

          {/* SAVE BUTTON HERE */}
          <button className="btn btn-primary mb-2" onClick={handleSave}>
            💾 Save Code
          </button>

          {output && (
            <pre
              style={{
                background: "white",
                color: "black",
                padding: "15px",
                border: "1px solid #ccc",
                minHeight: "150px",
                fontSize: "16px"
              }}
            >
              {output}
            </pre>
          )}

          {error && (
            <div style={{ marginTop: "10px" }}>
              <h5 style={{ color: "red" }}>Error:</h5>
              <pre>{error}</pre>

              <button className="btn btn-warning m-1" onClick={handleFixIt}>
                Fix It (Open AI Chat)
              </button>

              <button className="btn btn-info m-1" onClick={handleExplanation}>
                Explanation
              </button>

              <button className="btn btn-secondary m-1" onClick={handleExit}>
                Exit
              </button>
            </div>
          )}

          {explanation && (
            <div style={{ marginTop: "10px" }}>
              <h5>Explanation:</h5>
              <pre>{explanation}</pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Monaco;