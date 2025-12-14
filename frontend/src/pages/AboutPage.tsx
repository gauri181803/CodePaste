import { Link } from "react-router-dom";

export default function AboutPage() {
    return (
        <div style={{ background: "#0d0d0d", minHeight: "100vh", color: "white" }}>

            {/* Header */}
            <header
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    background: "#141414",
                    borderBottom: "1px solid #2a2a2a",
                    padding: "12px 24px",
                    height: "56px",
                    boxSizing: "border-box",
                }}
            >
                <Link to="/" style={{ textDecoration: "none", color: "white" }}>
                    <h1 style={{ margin: 0, fontSize: "26px", fontWeight: "bold" }}>
                        CodePaste
                    </h1>
                </Link>

                <nav style={{ display: "flex", gap: "16px" }}>
                    <Link style={navLink} to="/">Home</Link>
                    <Link style={navLink} to="/about">About</Link>
                    <a style={navLink} href="https://github.com/" target="_blank">
                        GitHub
                    </a>
                </nav>
            </header>

            {/* Main Content */}
            <section
                style={{
                    maxWidth: "800px",
                    margin: "60px auto",
                    padding: "0 24px",
                    textAlign: "center",
                }}
            >
                <h3 style={{ fontSize: "22px", marginBottom: "16px", marginTop: "40px" }}>
                    Our Goal
                </h3>
                <p style={{ fontSize: "18px", color: "#ccc", lineHeight: "1.6" }}>
                    To provide a clean, distraction-free space for developers, students,
                    and teams to quickly store, format, and share code.
                </p>

                <h3 style={{ fontSize: "22px", marginBottom: "16px", marginTop: "40px" }}>
                    What You Can Do
                </h3>

                <ul style={listStyle}>
                    <li>Paste and edit code with VS Code–quality highlighting</li>
                    <li>Choose from multiple programming languages</li>
                    <li>Create and share unique room URLs instantly</li>
                    <li>Auto-save and manual sync support</li>
                </ul>
                <h2 style={{ fontSize: "36px", marginBottom: "20px", fontWeight: "700" }}>
                    About CodePaste
                </h2>

                <p style={{ fontSize: "18px", color: "#ccc", lineHeight: "1.6", marginBottom: "30px" }}>
                    CodePaste is a simple and fast online code editor designed for effortless
                    sharing and organizing of code snippets. No accounts, no setup—
                    just create a room, paste your code, pick a language, and share the link.
                </p>

            </section>

            {/* Footer */}
            <footer
                style={{
                    padding: "20px",
                    textAlign: "center",
                    color: "#888",
                    borderTop: "1px solid #2a2a2a",
                }}
            >
                © 2025 CodePaste — Simple. Fast. Shareable.
            </footer>
        </div>
    );
}

const navLink: React.CSSProperties = {
    color: "#ddd",
    textDecoration: "none",
    fontSize: "16px",
};

const listStyle: React.CSSProperties = {
    listStyle: "none",
    padding: 0,
    margin: 0,
    color: "#ccc",
    fontSize: "18px",
    lineHeight: "1.8",
};
