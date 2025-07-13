import React, { useEffect } from "react";
import { FaGithub } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

function LandingPage() {
  const navigate = useNavigate();

  // Check for existing token on component mount
  useEffect(() => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      navigate("/dashboard");
    }

    // Handle OAuth callback if returning from GitHub
    const urlParams = new URLSearchParams(window.location.search);
    const tokenParam = urlParams.get("token");
    
    if (tokenParam) {
      localStorage.setItem("jwtToken", tokenParam);
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleGitHubLogin = () => {
    // Redirect to your backend OAuth endpoint
    window.location.href = "http://localhost:3001/auth/github";
  };

  return (
    <div className="landing-page">
      <header className="landing-header">
        <h1 className="landing-title">Docify</h1>
        <p className="landing-tagline">
          Generate clean, structured documentation from your repositories.
        </p>
        <div className="landing-actions">
          <button onClick={handleGitHubLogin} className="github-login-btn">
            <FaGithub className="github-icon" />
            Continue with GitHub
          </button>
        </div>
      </header>

      <section className="features-section">
        <div className="feature">
          <h2>🔍 Analyze Your Code</h2>
          <p>
            Connect your repo and we'll scan your files to extract relevant
            documentation.
          </p>
        </div>
        <div className="feature">
          <h2>🧠 AI-Powered Summaries</h2>
          <p>
            Understand your codebase faster with smart summaries of key files and
            functions.
          </p>
        </div>
        <div className="feature">
          <h2>📄 Clean Docs</h2>
          <p>
            Download or preview ready-to-use documentation — perfect for handoffs
            and teams.
          </p>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;