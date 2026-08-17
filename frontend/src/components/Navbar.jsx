import React from 'react';
import { Film, Plus, LogOut, User, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = ({ onOpenAddModal }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div className="brand">
          <div className="brand-icon-wrapper">
            <Film size={18} />
          </div>
          <div className="brand-text">
            <span className="brand-title unique-brand-font">My Movie Watchlist</span>
            <span className="brand-subtitle">Personal Film & TV Archive</span>
          </div>
        </div>


        {/* Action Controls */}
        <div className="navbar-actions">
          <button
            type="button"
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={isDark ? 'Switch to Light theme' : 'Switch to Dark theme'}
            aria-label="Toggle theme"
          >
            {isDark ? <Sun size={17} /> : <Moon size={17} />}
          </button>

          <button
            className="btn btn-primary"
            onClick={onOpenAddModal}
            title="Add a new movie or TV show"
          >
            <Plus size={16} />
            <span>Add Title</span>
          </button>

          <div className="user-profile">
            <div className="user-avatar" title={`Logged in as ${user?.username}`}>
              <User size={15} />
              <span className="user-name">{user?.username}</span>
            </div>
            <button
              className="btn btn-ghost"
              onClick={logout}
              title="Log out"
              aria-label="Log out"
            >
              <LogOut size={16} />
              <span className="logout-text">Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
