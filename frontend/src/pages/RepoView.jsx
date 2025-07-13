import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../styles/RepoView.css";

function RepoView() {
  const [state, setState] = useState({
    files: [],
    repo: null,
    loading: true,
    error: null,
  });
  const navigate = useNavigate();
  const { owner, repoName } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          throw new Error("Authentication required");
        }

        if (owner === "unknown") {
          throw new Error("Invalid repository owner");
        }

        const [repoRes, contentsRes] = await Promise.all([
          fetch(`http://localhost:3001/api/repos/${owner}/${repoName}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(
            `http://localhost:3001/api/repos/${owner}/${repoName}/contents`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          ),
        ]);

        if (!repoRes.ok) {
          const errorData = await repoRes.json();
          throw new Error(errorData.error || "Failed to fetch repository");
        }

        if (!contentsRes.ok) {
          const errorData = await contentsRes.json();
          throw new Error(errorData.error || "Failed to fetch contents");
        }

        const [repo, files] = await Promise.all([
          repoRes.json(),
          contentsRes.json(),
        ]);

        setState({
          files,
          repo,
          loading: false,
          error: null,
        });
      } catch (err) {
        setState({
          files: [],
          repo: null,
          loading: false,
          error: {
            message: err.message,
            details: err.details,
            suggestion: err.suggestion,
          },
        });

        if (err.message.includes("Authentication")) {
          localStorage.removeItem("jwtToken");
          localStorage.removeItem("user");
          navigate("/login");
        }
      }
    };

    fetchData();
  }, [owner, repoName, navigate]);

  if (state.loading) {
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

  if (state.error) {
    return (
      <div className="repoview-container">
        <Navbar />
        <div className="repoview-error">
          <h2>Error Loading Repository</h2>
          <p>{state.error.message}</p>
          {state.error.details && (
            <p className="error-details">
              {JSON.stringify(state.error.details)}
            </p>
          )}
          {state.error.suggestion && (
            <p className="error-suggestion">{state.error.suggestion}</p>
          )}
          <button
            onClick={() => navigate("/dashboard")}
            className="back-button"
          >
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
            <button
              className="back-button"
              onClick={() => navigate("/dashboard")}
            >
              ← Back to Repositories
            </button>
            <h1 className="repo-title">
              Repository: {state.repo?.full_name || `${owner}/${repoName}`}
            </h1>
          </div>

          <div className="file-list">
            <div className="actions">
              <button
                className="generate-button"
                onClick={() => {
                  // Your generate docs logic here
                }}
              >
                Generate Documentation
              </button>
            </div>
            <h3>Repository Contents:</h3>
            <div className="file-listing">
              {state.files.length > 0 ? (
                state.files.map((file) => (
                  <div key={file.path} className="file-item">
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
        </div>
      </main>
    </div>
  );
}

export default RepoView;
