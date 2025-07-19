import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/RepoView.css";

function RepoView() {
  const [files, setFiles] = useState([]);
  const [repo, setRepo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState("");
  const [documentation, setDocumentation] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [context, setContext] = useState("");
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { owner, repoName } = useParams();

  // Helper function to map file extensions to language names
  const getLanguageFromExtension = (ext) => {
    const languageMap = {
      js: "JavaScript",
      ts: "TypeScript",
      py: "Python",
      java: "Java",
      cpp: "C++",
      c: "C",
      cs: "C#",
      go: "Go",
      rb: "Ruby",
      php: "PHP",
      swift: "Swift",
      kt: "Kotlin",
      rs: "Rust",
      md: "Markdown",
      json: "JSON",
      html: "HTML",
      css: "CSS",
      scss: "SCSS",
      // Add more mappings as needed
    };
    return languageMap[ext.toLowerCase()] || ext;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) throw new Error("Please login first");

        const [repoRes, contentsRes] = await Promise.all([
          fetch(`http://localhost:3001/api/repos/${owner}/${repoName}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`http://localhost:3001/api/repos/${owner}/${repoName}/contents`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!repoRes.ok || !contentsRes.ok) {
          const errorData = await repoRes.json().catch(() => ({}));
          throw new Error(errorData.error || "Failed to fetch repository data");
        }

        const [repoData, contentsData] = await Promise.all([
          repoRes.json(),
          contentsRes.json(),
        ]);

        setRepo(repoData);
        setFiles(contentsData);
      } catch (err) {
        console.error("Fetch error:", err);
        setError({
          message: err.message,
          details: err.response?.data,
        });
        if (err.message.includes("login")) {
          localStorage.removeItem("jwtToken");
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [owner, repoName, navigate]);

  const fetchFileContent = async (file) => {
    try {
      const token = localStorage.getItem("jwtToken");
      const response = await fetch(
        `http://localhost:3001/api/repos/${owner}/${repoName}/contents/${file.path}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!response.ok) throw new Error("Failed to load file");

      const data = await response.json();
      const content = data.content
        ? atob(data.content.replace(/\s/g, ""))
        : "Empty file";

      setSelectedFile(file);
      setFileContent(content);
      setDocumentation("");
      setError(null);
    } catch (err) {
      setError({
        message: "File load failed",
        details: err.message,
      });
    }
  };

  const generateDocumentation = async () => {
    // Debug: Log initial state
    console.log('Starting generation...', {
      selectedFile,
      fileContent: fileContent?.length,
      isGenerating
    });
  
    if (!selectedFile) {
      console.error('No file selected');
      setError({
        message: "No file selected",
        details: "Please click on a file first"
      });
      return;
    }
  
    if (!fileContent) {
      console.error('No file content loaded');
      setError({
        message: "File content not loaded",
        details: "Click on the file to load its content"
      });
      return;
    }
  
    setIsGenerating(true);
    setDocumentation("");
    setError(null);
  
    try {
      const token = localStorage.getItem("jwtToken");
      if (!token) {
        throw new Error("No authentication token found");
      }
  
      const fileExtension = selectedFile.name.split('.').pop();
      const language = getLanguageFromExtension(fileExtension);
  
      // Debug: Log request payload
      console.log('Sending request with:', {
        language,
        length: fileContent.length,
        fileName: selectedFile.name
      });
  
      const response = await fetch("http://localhost:3001/api/docs/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          code: fileContent,
          language,
          context,
          fileName: selectedFile.name
        })
      });
  
      // Debug: Log response status
      console.log('Response status:', response.status);
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Generation failed");
      }
  
      const result = await response.json();
      console.log('Generation successful:', result);
      setDocumentation(result.documentation);
  
    } catch (error) {
      console.error('Generation error:', error);
      setError({
        message: "Failed to generate documentation",
        details: error.message,
        suggestion: "Check console for details"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="repoview-container">
        <Navbar />
        <div className="repoview-loading">
          <div className="spinner"></div>
          <p>Loading repository data...</p>
        </div>
      </div>
    );
  }

  if (error && !selectedFile) {
    return (
      <div className="repoview-container">
        <Navbar />
        <div className="repoview-error">
          <h2>Error Loading Repository</h2>
          <p>{error.message}</p>
          {error.details && <p className="error-details">{error.details}</p>}
          <button onClick={() => navigate("/dashboard")} className="back-button">
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="repoview-container">
      <Navbar />
      <main className="repoview-main">
        <div className="repo-view">
          <div className="repo-header">
            <button className="back-button" onClick={() => navigate("/dashboard")}>
              ← Back to Repositories
            </button>
            <h1 className="repo-title">
              Repository: {repo?.full_name || `${owner}/${repoName}`}
            </h1>
          </div>

          <div className="file-list">
            <div className="actions">
              <button
                className={`generate-button ${isGenerating ? "generating" : ""}`}
                onClick={generateDocumentation}
                disabled={isGenerating || !selectedFile || !fileContent}
                aria-busy={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <span className="spinner"></span>
                    Generating... {progress}%
                  </>
                ) : (
                  "Generate Documentation"
                )}
              </button>
              {isGenerating && (
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              )}
            </div>

            {error && (
              <div className="error-message">
                <p>{error.message}</p>
                {error.details && <p>{error.details}</p>}
                {error.suggestion && <p className="suggestion">{error.suggestion}</p>}
              </div>
            )}

            <h3>Repository Contents:</h3>
            <div className="file-listing">
              {files.length > 0 ? (
                files.map((file) => (
                  <div
                    key={file.path}
                    className={`file-item ${
                      selectedFile?.path === file.path ? "selected" : ""
                    }`}
                    onClick={() => fetchFileContent(file)}
                  >
                    <span className="file-name">
                      {file.type === "dir" ? "📁" : "📄"} {file.name}
                      {file.type === "file" && (
                        <span className="file-size">
                          ({Math.round(file.size / 1024)} KB)
                        </span>
                      )}
                    </span>
                  </div>
                ))
              ) : (
                <p>No files found in this repository</p>
              )}
            </div>
          </div>

          {selectedFile && (
            <div className="file-content-section">
              <h3>Selected File: {selectedFile.name}</h3>
              <div className="file-content-container">
                <pre className="file-content">{fileContent}</pre>
              </div>
              <div className="documentation-controls">
                <textarea
                  className="context-input"
                  value={context}
                  onChange={(e) => setContext(e.target.value)}
                  placeholder="Add additional context (e.g., 'Focus on the main function' or 'Explain the data flow')"
                />
              </div>
            </div>
          )}

          {documentation && (
            <div className="documentation-section">
              <div className="docs-header">
                <h3>Documentation for {selectedFile?.name}</h3>
                <button
                  className="copy-button"
                  onClick={() => {
                    navigator.clipboard.writeText(documentation);
                    alert("Copied to clipboard!");
                  }}
                >
                  📋 Copy
                </button>
              </div>
              <div className="documentation-container">
                <pre className="documentation-content">{documentation}</pre>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default RepoView;