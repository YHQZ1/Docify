import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import RepoCard from "../components/RepoCard";
import Navbar from "../components/Navbar";
import "../styles/Dashboard.css";

function Dashboard() {
  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleAuthRedirect = () => {
      const token = searchParams.get("token");
      const userParam = searchParams.get("user");

      if (token && userParam) {
        localStorage.setItem("jwtToken", token);
        localStorage.setItem("user", userParam);
        setUser(JSON.parse(decodeURIComponent(userParam)));
        window.history.replaceState({}, "", "/dashboard");
        return token;
      }
      return null;
    };

    const checkExistingSession = () => {
      const token = localStorage.getItem("jwtToken");
      const userData = localStorage.getItem("user");
      
      if (token && userData) {
        setUser(JSON.parse(userData));
        return token;
      }
      return null;
    };

    const fetchRepositories = async (token) => {
      try {
        const response = await fetch("http://localhost:3001/api/repos", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch repositories");
        }

        const data = await response.json();
        
        // Filter and validate repositories
        const validRepos = data.filter(repo => {
          const hasOwner = repo.owner?.login || (repo.full_name && repo.full_name.includes('/'));
          if (!hasOwner) {
            console.warn('Invalid repository skipped:', repo);
          }
          return hasOwner;
        });

        setRepos(validRepos);
      } catch (err) {
        setError({
          message: err.message,
          details: err.details
        });
      } finally {
        setLoading(false);
      }
    };

    const initializeSession = async () => {
      try {
        const token = handleAuthRedirect() || checkExistingSession();
        
        if (!token) {
          navigate("/");
          return;
        }

        await fetchRepositories(token);
      } catch (err) {
        setError({
          message: err.message,
          details: err.details
        });
        setLoading(false);
      }
    };

    initializeSession();
  }, [navigate, searchParams]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="dashboard-loading">
          <div className="spinner"></div>
          <p>Loading repositories...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="dashboard-error">
          <h2>Error Loading Repositories</h2>
          <p>{error.message}</p>
          {error.details && (
            <pre className="error-details">{JSON.stringify(error.details, null, 2)}</pre>
          )}
          <button 
            onClick={() => window.location.reload()}
            className="retry-button"
          >
            Try Again
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <main className="dashboard-main">
        <div className="dashboard-container">
          <div className="dashboard-wrapper">
            <h1 className="dashboard-title">Your Repositories</h1>
            {repos.length === 0 ? (
              <div className="no-repos">
                <p>No repositories found</p>
              </div>
            ) : (
              <div className="repo-grid">
                {repos.map((repo) => (
                  <RepoCard
                    key={repo.id}
                    repo={repo}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}

export default Dashboard;