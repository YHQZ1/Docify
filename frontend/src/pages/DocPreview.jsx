import React from "react";
import "../styles/DocPreview.css";
import Navbar from "../components/Navbar";
import { useParams, Link } from "react-router-dom";

function DocPreview() {
  const { repoId, filePath } = useParams();

  return (
    <>
      <Navbar />
      <div className="doc-preview-container">
        <header className="doc-header">
          <h1 className="doc-title">Generated Documentation</h1>
          <p className="doc-subtitle">
            Preview of the extracted docs for <strong>{repoId}</strong> →{" "}
            <code>{filePath}</code>
          </p>
        </header>

        <section className="doc-content">
          <article className="doc-section">
            <h2>File: utils/helpers.js</h2>
            <p>
              This file contains utility functions used for data transformation.
              The functions are pure and reusable across different modules.
            </p>

            <h3>
              Function: <code>formatDate(date)</code>
            </h3>
            <p>
              Takes a JavaScript Date object and returns a formatted string in{" "}
              <code>DD-MM-YYYY</code> format.
            </p>
          </article>

          <article className="doc-section">
            <h2>File: services/api.js</h2>
            <p>
              Handles all network requests using fetch. Manages headers,
              response parsing, and error handling.
            </p>

            <h3>
              Function: <code>fetchUserData(userId)</code>
            </h3>
            <p>
              Sends a GET request to <code>/api/users/:id</code> and returns
              user data in JSON format.
            </p>
          </article>
        </section>

        <footer className="doc-footer">
          <Link to="/dashboard" className="doc-back-link">
            ← Back to Dashboard
          </Link>
          <button className="doc-download-btn">Download Docs</button>
        </footer>
      </div>
    </>
  );
}

export default DocPreview;
