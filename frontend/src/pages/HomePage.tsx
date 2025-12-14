import React, { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Link, useNavigate } from "react-router-dom";

export default function HomePage() {
  const [sample, setSample] = useState(`// Welcome to CodePaste 👋

// Paste, edit, and share code instantly.
// Syntax highlighted. Multi-language. VS Code-like.

function hello(name: string) {
  console.log("Hello", name);
}

hello("Gauriiii");
`);

  // Load last room name from localStorage
  const [roomName, setRoomName] = useState(() => {
    return localStorage.getItem("lastRoom") || "";
  });

  const navigate = useNavigate();

  // Save roomName to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("lastRoom", roomName);
  }, [roomName]);

  // Generate random 6-char ID
  const randomId = () => Math.random().toString(36).slice(2, 8).toUpperCase();

  const createRoom = () => {
    const name = roomName.trim() || randomId();

    // Save last used room in localStorage
    localStorage.setItem("lastRoom", name);

    navigate(`/${name}`);
  };

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
    <div>helo</div>
    // <div style={{ background: "#0d0d0d", minHeight: "100vh", color: "white" }}>

    //   {/* Navbar */}
    //   <header style={headerStyle}>
    //     <Link to="/" style={{ textDecoration: "none", color: "white" }}>
    //       <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "bold" }}>
    //         CodePaste
    //       </h1>
    //     </Link>

    //     <nav style={{ display: "flex", gap: "16px" }}>
    //       <Link style={navLink} to="/about">About</Link>
    //       <a style={navLink} href="https://github.com/" target="_blank">
    //         GitHub
    //       </a>
    //     </nav>
    //   </header>


    //   {/* Hero Section */}
    //   <section
    //     style={{
    //       padding: "60px 32px",
    //       textAlign: "center",
    //       maxWidth: "900px",
    //       margin: "0 auto",
    //     }}
    //   >
    //     <h2 style={{ fontSize: "42px", fontWeight: "700", marginBottom: "20px" }}>
    //       Paste • Edit • Share Code Instantly
    //     </h2>

    //     <p style={{ fontSize: "18px", color: "#ccc", marginBottom: "32px" }}>
    //       A clean and fast online code editor built with Monaco — syntax highlighted,
    //       multi-language, and perfect for sharing snippets with developers,
    //       students, documentation writers, and AI agents.
    //     </p>

    //     {/* ROOM CREATION UI */}
    //     <div style={{ marginTop: "20px", display: "flex", justifyContent: "center", gap: "10px" }}>
    //       <input
    //         value={roomName}
    //         onChange={(e) => setRoomName(e.target.value)}
    //         placeholder="Enter room name"
    //         style={{
    //           padding: "14px",
    //           width: "320px",
    //           borderRadius: "8px",
    //           border: "1px solid #555",
    //           background: "#1e1e1e",
    //           color: "white",
    //           fontSize: "18px",
    //           fontWeight: "500",
    //         }}
    //       />

    //       <button
    //         onClick={createRoom}
    //         style={{
    //           padding: "12px 24px",
    //           borderRadius: "8px",
    //           background: "#0078ff",
    //           border: "none",
    //           color: "white",
    //           fontSize: "16px",
    //           cursor: "pointer",
    //           fontWeight: "600",
    //         }}
    //       >
    //         Create Room →
    //       </button>
    //     </div>

    //     <p style={{ color: "#888", marginTop: "12px" }}>
    //       Leave blank to generate a random room ID.
    //     </p>
    //   </section>

    //   {/* Monaco Demo Editor */}
    //   <section
    //     style={{
    //       maxWidth: "1000px",
    //       margin: "40px auto",
    //       padding: "0 16px",
    //     }}
    //   >
    //     <Editor
    //       height="350px"
    //       theme="vs-dark"
    //       defaultLanguage="typescript"
    //       value={sample}
    //       onChange={(v: any) => setSample(v || "")}
    //     />
    //   </section>

    //   {/* Feature List */}
    //   <section
    //     style={{
    //       maxWidth: "900px",
    //       margin: "60px auto",
    //       padding: "0 16px",
    //       display: "grid",
    //       gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    //       gap: "32px",
    //     }}
    //   >
    //     {features.map((f) => (
    //       <div
    //         key={f.title}
    //         style={{
    //           background: "#141414",
    //           padding: "24px",
    //           borderRadius: "12px",
    //           border: "1px solid #2a2a2a",
    //         }}
    //       >
    //         <h3 style={{ marginBottom: "10px" }}>{f.title}</h3>
    //         <p style={{ color: "#b5b5b5" }}>{f.desc}</p>
    //       </div>
    //     ))}
    //   </section>

    //   {/* Footer */}
    //   <footer
    //     style={{
    //       padding: "20px",
    //       textAlign: "center",
    //       color: "#888",
    //       borderTop: "1px solid #2a2a2a",
    //     }}
    //   >
    //     © 2025 CodePaste — Paste · Edit · Share
    //   </footer>
    // </div>
  );
}

// navbar links
const navLink: React.CSSProperties = {
  color: "#ddd",
  textDecoration: "none",
  fontSize: "16px",
};

// features list
const features = [
  { title: "Multi-Language Support", desc: "Python, JS, TS, HTML, CSS, JSON and more." },
  { title: "VS Code Editor", desc: "Powered by Monaco — the same editor behind VS Code." },
  { title: "Shareable Rooms", desc: "Each room gets a unique link you can share instantly." },
  { title: "Lightweight & Fast", desc: "Instant load time. No login required." },
  { title: "Perfect for Students", desc: "Practice coding online with syntax highlighting." },
  { title: "AI Friendly", desc: "Ideal for AI parsing, formatting, and code assistance." },
];
