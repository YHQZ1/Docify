import React from 'react';
import { Search, Home, ArrowLeft, FileText, Code, GitBranch } from 'lucide-react';

function DocPreview() {
  return (
    <>
      <style>{`
        .not-found-container {
          min-height: 100vh;
          background-color: var(--bg-primary);
          display: flex;
          flex-direction: column;
          font-family: var(--font-primary);
        }

        .header {
          border-bottom: 1px solid var(--border-color);
          background-color: var(--bg-canvas);
          padding: 0 var(--space-md);
        }

        .header-content {
          max-width: var(--container-xl);
          margin: 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 64px;
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: var(--space-md);
        }

        .logo-text {
          font-size: var(--text-xl);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
        }

        .search-container {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-input {
          padding-left: 40px;
          padding-right: var(--space-md);
          padding-top: var(--space-sm);
          padding-bottom: var(--space-sm);
          border: 1px solid var(--border-color);
          border-radius: var(--radius-md);
          font-size: var(--text-sm);
          background-color: var(--bg-primary);
          color: var(--text-primary);
          outline: none;
          transition: var(--transition-fast);
          width: 280px;
        }

        .search-input:focus {
          border-color: var(--border-focus);
          box-shadow: var(--shadow-focus);
        }

        .search-icon {
          position: absolute;
          left: 12px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .main-content {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-2xl) var(--space-md);
        }

        .content-wrapper {
          max-width: 640px;
          width: 100%;
          text-align: center;
        }

        .error-visual {
          margin-bottom: var(--space-2xl);
          position: relative;
        }

        .error-number {
          font-size: 12rem;
          font-weight: var(--font-bold);
          color: var(--bg-secondary);
          line-height: 1;
          user-select: none;
          margin-bottom: var(--space-md);
        }

        .floating-card {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-3deg);
          background-color: var(--bg-canvas);
          border: 2px solid var(--border-color);
          border-radius: var(--radius-lg);
          padding: var(--space-2xl);
          box-shadow: var(--shadow-lg);
          transition: var(--transition-normal);
        }

        .floating-card:hover {
          transform: translate(-50%, -50%) rotate(0deg);
        }

        .card-icon {
          margin: 0 auto var(--space-md);
          color: var(--text-muted);
        }

        .card-filename {
          font-size: var(--text-sm);
          color: var(--text-secondary);
          font-family: var(--font-mono);
        }

        .error-message {
          margin-bottom: var(--space-2xl);
        }

        .error-title {
          font-size: var(--text-3xl);
          font-weight: var(--font-bold);
          color: var(--text-primary);
          margin-bottom: var(--space-md);
        }

        .error-description {
          font-size: var(--text-lg);
          color: var(--text-secondary);
          margin-bottom: var(--space-lg);
          line-height: var(--leading-relaxed);
        }

        .warning-box {
          background-color: var(--warning-light);
          border: 1px solid var(--warning-color);
          border-radius: var(--radius-md);
          padding: var(--space-md);
          margin-bottom: var(--space-lg);
          display: flex;
          align-items: flex-start;
          gap: var(--space-sm);
        }

        .warning-icon {
          color: var(--warning-color);
          flex-shrink: 0;
          margin-top: 2px;
        }

        .warning-text {
          font-size: var(--text-sm);
          color: var(--warning-color);
          line-height: var(--leading-normal);
        }

        .action-buttons {
          display: flex;
          flex-direction: column;
          gap: var(--space-md);
          align-items: center;
          margin-bottom: var(--space-2xl);
        }

        .btn {
          display: inline-flex;
          align-items: center;
          padding: var(--space-sm) var(--space-lg);
          font-size: var(--text-base);
          font-weight: var(--font-medium);
          border-radius: var(--radius-md);
          text-decoration: none;
          border: none;
          cursor: pointer;
          transition: var(--transition-fast);
          gap: var(--space-sm);
        }

        .btn-primary {
          background-color: var(--primary-color);
          color: var(--text-white);
          border: 1px solid var(--primary-color);
        }

        .btn-primary:hover {
          background-color: var(--primary-hover);
          border-color: var(--primary-hover);
        }

        .btn-secondary {
          background-color: var(--bg-secondary);
          color: var(--text-primary);
          border: 1px solid var(--border-color);
        }

        .btn-secondary:hover {
          background-color: var(--bg-tertiary);
          border-color: var(--border-hover);
        }

        .suggestions {
          text-align: left;
          max-width: 512px;
          margin: 0 auto;
        }

        .suggestions-title {
          font-size: var(--text-lg);
          font-weight: var(--font-semibold);
          color: var(--text-primary);
          margin-bottom: var(--space-md);
        }

        .suggestions-list {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .suggestions-item {
          display: flex;
          align-items: flex-start;
          gap: var(--space-sm);
          margin-bottom: var(--space-sm);
          color: var(--text-secondary);
          line-height: var(--leading-relaxed);
        }

        .bullet {
          width: 8px;
          height: 8px;
          background-color: var(--primary-color);
          border-radius: 50%;
          margin-top: 8px;
          flex-shrink: 0;
        }

        .footer {
          border-top: 1px solid var(--border-color);
          background-color: var(--bg-secondary);
          padding: var(--space-lg) var(--space-md);
        }

        .footer-content {
          max-width: var(--container-xl);
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: var(--space-sm);
          font-size: var(--text-sm);
          color: var(--text-secondary);
        }

        .footer-brand {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .footer-links {
          display: flex;
          gap: var(--space-lg);
        }

        .footer-link {
          color: var(--text-link);
          text-decoration: none;
          transition: var(--transition-fast);
        }

        .footer-link:hover {
          color: var(--text-link-hover);
        }

        @media (min-width: 640px) {
          .action-buttons {
            flex-direction: row;
            justify-content: center;
          }

          .footer-content {
            flex-direction: row;
            justify-content: space-between;
          }
        }
      `}</style>

      <div className="not-found-container">
        {/* Header */}
        <header className="header">
          <div className="header-content">
            <div className="logo-section">
              <Code size={32} color="var(--primary-color)" />
              <span className="logo-text">Docify</span>
            </div>
            <div className="search-container">
              <Search size={16} className="search-icon" />
              <input
                type="text"
                placeholder="Search documentation..."
                className="search-input"
              />
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="main-content">
          <div className="content-wrapper">
            {/* Animated 404 */}
            <div className="error-visual">
              <div className="error-number">404</div>
              <div className="floating-card">
                <FileText size={64} className="card-icon" />
                <div className="card-filename">documentation.md</div>
              </div>
            </div>

            {/* Error Message */}
            <div className="error-message">
              <h1 className="error-title">Documentation Not Found</h1>
              <p className="error-description">
                Oops! The documentation page you're looking for seems to have wandered off into the void.
              </p>
              <div className="warning-box">
                <GitBranch size={20} className="warning-icon" />
                <p className="warning-text">
                  This might be because the documentation is still being generated, 
                  or the repository structure has changed.
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                onClick={() => window.history.back()}
                className="btn btn-primary"
              >
                <ArrowLeft size={20} />
                Go Back
              </button>
              <button 
                onClick={() => window.location.href = '/'}
                className="btn btn-secondary"
              >
                <Home size={20} />
                Home
              </button>
            </div>

            {/* Suggestions */}
            <div className="suggestions">
              <h3 className="suggestions-title">What can you do instead?</h3>
              <ul className="suggestions-list">
                <li className="suggestions-item">
                  <span className="bullet"></span>
                  <span>Check the URL for any typos or formatting issues</span>
                </li>
                <li className="suggestions-item">
                  <span className="bullet"></span>
                  <span>Use the search bar to find the documentation you need</span>
                </li>
                <li className="suggestions-item">
                  <span className="bullet"></span>
                  <span>Browse the main documentation index</span>
                </li>
                <li className="suggestions-item">
                  <span className="bullet"></span>
                  <span>Wait a moment if the documentation is being generated</span>
                </li>
              </ul>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-brand">
              <Code size={16} />
              <span>Docify - GitHub Documentation Generator</span>
            </div>
            <div className="footer-links">
              <a href="#" className="footer-link">Help</a>
              <a href="#" className="footer-link">Status</a>
              <a href="#" className="footer-link">Contact</a>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}

export default DocPreview;