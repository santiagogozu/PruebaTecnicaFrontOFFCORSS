import React from "react";

const Footer: React.FC = () => {
  return (
    <footer
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "1.5rem 0",
        background: "#f8f9fa",
        borderTop: "1px solid #e0e0e0",
        fontSize: "1rem",
        color: "#333",
      }}
    >
      <div style={{display: "flex", alignItems: "center", gap: 4}}>
        © 2025, hecho para OFFCORSS con
        <span
          style={{color: "#e25555", margin: "0 4px"}}
          aria-label="love"
          role="img"
        >
          ♥
        </span>
        por
        <a
          href="https://www.linkedin.com/in/santiago-gonzalez-zuluaga/"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            margin: "0 4px",
            color: "#0077b5",
            textDecoration: "none",
            fontWeight: 500,
          }}
        >
          Santiago González Zuluaga
        </a>
      </div>
      <ul
        style={{
          display: "flex",
          listStyle: "none",
          padding: 0,
          flexDirection: "row",
          gap: "1.5rem",
        }}
      >
        <li>
          <a
            href="https://www.linkedin.com/in/santiago-gonzalez-zuluaga/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#0077b5",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: 24,
            }}
            aria-label="LinkedIn"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.27c-.966 0-1.75-.79-1.75-1.76 0-.97.784-1.76 1.75-1.76s1.75.79 1.75 1.76c0 .97-.784 1.76-1.75 1.76zm13.5 11.27h-3v-5.6c0-1.34-.03-3.07-1.87-3.07-1.87 0-2.16 1.46-2.16 2.97v5.7h-3v-10h2.89v1.36h.04c.4-.76 1.38-1.56 2.84-1.56 3.04 0 3.6 2 3.6 4.59v5.61z" />
            </svg>
          </a>
        </li>
        <li>
          <a
            href="https://github.com/santiagogozu"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#333",
              textDecoration: "none",
              fontWeight: 500,
              fontSize: 24,
            }}
            aria-label="GitHub"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12 0.297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.387.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.416-4.042-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.084-.729.084-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.809 1.304 3.495.997.108-.775.418-1.305.762-1.605-2.665-.305-5.466-1.334-5.466-5.931 0-1.31.469-2.381 1.236-3.221-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.553 3.297-1.23 3.297-1.23.653 1.653.242 2.873.119 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.803 5.624-5.475 5.921.43.371.823 1.102.823 2.222 0 1.606-.014 2.898-.014 3.293 0 .322.216.694.825.576 4.765-1.588 8.199-6.084 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </a>
        </li>
      </ul>
    </footer>
  );
};

export default Footer;
