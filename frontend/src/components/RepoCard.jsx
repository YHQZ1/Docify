import React from "react";
import { Link } from "react-router-dom";
import "../styles/RepoCard.css";

function RepoCard({ repo }) {
  const owner = repo.owner?.login || (repo.full_name && repo.full_name.split('/')[0]) || 'unknown';
  
  return (
    <div className="repo-card">
      <div className="repo-header">
        <h2 className="repo-name">{repo.name}</h2>
        <span className={`repo-privacy ${repo.private ? "private" : "public"}`}>
          {repo.private ? "Private" : "Public"}
        </span>
      </div>
      
      <p className="repo-description">
        {repo.description || "No description provided"}
      </p>
      
      <div className="repo-footer">
        {repo.language && (
          <span className="repo-language">{repo.language}</span>
        )}
        <Link
          to={`/repo/${owner}/${repo.name}`}
          className="repo-link"
          state={{ repo }}
        >
          View →
        </Link>
      </div>
    </div>
  );
}

export default RepoCard;