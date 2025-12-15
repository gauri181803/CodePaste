import { useState, useEffect, useRef } from "react";
import Editor from "@monaco-editor/react";
import { Link, useParams } from "react-router-dom";

type SyncStatus = "saved" | "pending" | "offline";

export default function EditorPage() {
  const { roomId } = useParams();

  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("plaintext");
  const [syncStatus, setSyncStatus] = useState<SyncStatus>(
    navigator.onLine ? "saved" : "offline"
  );
  const [copied, setCopied] = useState(false);

  const saveTimeoutRef = useRef<number | null>(null);

  /* ---------------- Load room data ---------------- */
  useEffect(() => {
    fetch(`http://localhost:4000/api/rooms/${roomId}`)
      .then((res) => res.json())
      .then((data) => {
        setCode(data.code || "");
        setLanguage(data.language || "plaintext");
      })
      .catch(() => setSyncStatus("offline"));
  }, [roomId]);

  /* ---------------- Save logic ---------------- */
  const saveToServer = (value: string, lang: string) => {
    fetch(`http://localhost:4000/api/rooms/${roomId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: value, language: lang }),
    })
      .then(() => setSyncStatus("saved"))
      .catch(() => setSyncStatus("offline"));
  };

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

  const manualSync = () => {
    saveToServer(code, language);
  };

  /* ---------------- Clipboard ---------------- */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      alert("Copy failed");
    }
  };

  /* ---------------- Icons ---------------- */
  const SyncIcons = {
    saved: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#4caf50">
        <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm-1 15l-4-4 1.41-1.42L11 13.17l4.59-4.59L17 10z" />
      </svg>
    ),
    pending: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#ffca28">
        <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm1 11h-2V7h2zm0 4h-2v-2h2z" />
      </svg>
    ),
    offline: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="#f44336">
        <path d="M12 2a10 10 0 1010 10A10 10 0 0012 2zm5.59 13L13 10.41 8.41 15 7 13.59 11.59 9 7 4.41 8.41 3l4.59 4.59L17.59 3 19 4.41 14.41 9 19 13.59z" />
      </svg>
    ),
  };

  /* ---------------- Header style ---------------- */
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
      {/* ---------------- Header ---------------- */}
      <div style={headerStyle}>
        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            color: "white",
            textDecoration: "none",
          }}
        >
          <img src="/logo.svg" alt="logo" width={32} height={32} />
          <h1 style={{ margin: 0, fontSize: "26px" }}>CodePaste</h1>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <button
            onClick={manualSync}
            title={syncStatus}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
            }}
          >
            {SyncIcons[syncStatus]}
          </button>

          <select
            value={language}
            onChange={(e) => {
              const newLang = e.target.value;
              setLanguage(newLang);
              saveToServer(code, newLang);
            }}
            style={{
              height: "32px",
              background: "#1f1f1f",
              color: "white",
              border: "1px solid #444",
              borderRadius: "6px",
            }}
          >
            {languageList.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* ---------------- Editor ---------------- */}
      <div style={{ position: "relative", height: "calc(100vh - 56px)" }}>
        {/* Copy Button */}
        <button
          onClick={copyToClipboard}
          style={{
            position: "absolute",
            top: "12px",
            right: "16px",
            zIndex: 10,
            background: copied ? "#2e7d32" : "#1f1f1f",
            color: "white",
            border: "1px solid #444",
            borderRadius: "6px",
            padding: "6px 10px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          {copied ? "✓ Copied" : "📋"}
        </button>

        <Editor
          height="100%"
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
    </div>
  );
}

/* ---------------- Languages ---------------- */
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
  { label: "Java", value: "java" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
];
