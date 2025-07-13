import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "../styles/Navbar.css";
import { Code, Sun, Moon } from "lucide-react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const [theme, setTheme] = useState(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) return savedTheme;
    return window.matchMedia("(prefers-color-scheme: dark)").matches 
      ? "dark" 
      : "light";
  });

  useEffect(() => {
    // Apply the theme class to the document
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    localStorage.removeItem("user");
    navigate("/");
  };

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  const getAvatarUrl = () => {
    if (user?.avatar) return user.avatar;
    if (user?.username)
      return `https://github.com/${user.username}.png?size=96`;
    return "https://via.placeholder.com/96";
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/dashboard" className="navbar-brand">
          <div className="logo-section">
            <Code size={32} className="logo-icon" />
            <span className="logo-text">Docify</span>
          </div>
        </Link>
      </div>

      {user && (
        <div className="navbar-right">
          <button 
            onClick={toggleTheme} 
            className="theme-toggle"
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? <Moon size={25} /> : <Sun size={25} />}
          </button>
          <div className="user-profile">
            <img
              src={getAvatarUrl()}
              alt={user.name || user.username}
              className="user-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = `https://github.com/${user.username}.png?size=96`;
              }}
            />
            <span className="user-name">{user.name || user.username}</span>
          </div>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}

export default Navbar;