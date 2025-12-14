import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Link, useParams } from "react-router-dom";

export default function EditorPage() {
  const { roomId } = useParams();
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("plaintext");

  const [syncStatus, setSyncStatus] =
    useState<"saved" | "pending" | "offline">(navigator.onLine ? "saved" : "offline");

  const saveTimeoutRef = useRef<number | null>(null);

  // Load room metadata (code + language)
  useEffect(() => {
    fetch(`http://localhost:4000/api/rooms/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        setCode(data.code || "");
        setLanguage(data.language || "plaintext");
      });
  }, [roomId]);

  // Debounced Save (code + language)
  const handleCodeChange = (value: string) => {
    setCode(value);

    if (!navigator.onLine) {
      setSyncStatus("offline");
      return;
    }

    setSyncStatus("pending");
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);

    saveTimeoutRef.current = window.setTimeout(() => {
      saveToServer(value, language);
    }, 600);
  };

  // Save to backend
  const saveToServer = (value: string, lang: string) => {
    fetch(`http://localhost:4000/api/rooms/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: value, language: lang }),
    })
      .then(() => setSyncStatus("saved"))
      .catch(() => setSyncStatus("offline"));
  };

  // Manual sync button
  const manualSync = () => {
    saveToServer(code, language);
  };

  // Sync Icons
  const SyncIcons = {
    saved: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#4caf50">
        <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm-1 15l-4-4 1.41-1.42L11 13.17l4.59-4.59L17 10z" />
      </svg>
    ),
    pending: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffca28">
        <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm1 11h-2V7h2zm0 4h-2v-2h2z" />
      </svg>
    ),
    offline: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#f44336">
        <path d="M12 2a10 10 0 1010 10A10.011 10.011 0 0012 2zm5.59 13L13 10.41 8.41 15 7 13.59 11.59 9 7 4.41 8.41 3l4.59 4.59L17.59 3 19 4.41 14.41 9 19 13.59z" />
      </svg>
    ),
  };

  // Shared Header Style
  const headerStyle: React.CSSProperties = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#141414",
    borderBottom: "1px solid #2a2a2a",
    padding: "12px 24px",
    height: "56px",
    boxSizing: "border-box",
  };

  return (
    <div style={{ height: "100vh", background: "#0d0d0d" }}>

      {/* Header */}
      <div style={headerStyle}>
        <Link to="/" style={{ textDecoration: "none", color: "white" }}>
          <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "bold" }}>
            CodePaste
          </h1>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>

          {/* Sync Button */}
          <button
            onClick={manualSync}
            title={
              syncStatus === "offline"
                ? "Offline – changes not saved"
                : syncStatus === "pending"
                ? "Saving…"
                : "Saved"
            }
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              padding: 0,
            }}
          >
            <div style={{ width: 20, height: 20 }}>
              {SyncIcons[syncStatus]}
            </div>
          </button>

          {/* Language Dropdown */}
          <select
            value={language}
            onChange={(e) => {
              const newLang = e.target.value;
              setLanguage(newLang);
              saveToServer(code, newLang); // Save immediately
            }}
            style={{
              padding: "4px 8px",
              borderRadius: "6px",
              background: "#1f1f1f",
              color: "white",
              border: "1px solid #444",
              fontSize: "14px",
              height: "32px",
            }}
          >
            {languageList.map((lang) => (
              <option value={lang.value} key={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Monaco Editor */}
      <Editor
        height="calc(100vh - 56px)"
        theme="vs-dark"
        language={language}
        value={code}
        onChange={(v) => handleCodeChange(v || "")}
        beforeMount={(monaco) => {
          monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true,
          });
          monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
            noSemanticValidation: true,
            noSyntaxValidation: true,
          });
        }}
        options={{
          minimap: { enabled: true },
          fontSize: 14,
          automaticLayout: true,
        }}
      />
    </div>
  );
}

const languageList = [
  { label: "Plain Text", value: "plaintext" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "Python", value: "python" },
  { label: "JSON", value: "json" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "Markdown", value: "markdown" },
  { label: "XML", value: "xml" },
  { label: "YAML", value: "yaml" },
  { label: "C", value: "c" },
  { label: "C++", value: "cpp" },
  { label: "C#", value: "csharp" },
  { label: "Java", value: "java" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "PHP", value: "php" },
  { label: "Ruby", value: "ruby" },
  { label: "Swift", value: "swift" },
  { label: "Kotlin", value: "kotlin" },
  { label: "Shell Script", value: "shell" },
  { label: "SQL", value: "sql" },
  { label: "Dockerfile", value: "dockerfile" },
  { label: "R", value: "r" },
  { label: "Lua", value: "lua" },
  { label: "Perl", value: "perl" },
  { label: "Objective-C", value: "objective-c" },
  { label: "Scala", value: "scala" },
  { label: "Haskell", value: "haskell" },
];
