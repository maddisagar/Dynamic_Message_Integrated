"use client"

import { Sun, Moon, Activity, BarChart3, BarChart2, History, Wifi, WifiOff, Menu } from 'lucide-react'
import { useState } from "react"

export default function Header({ darkMode, toggleTheme, isConnected, currentView, setCurrentView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo" onClick={() => setCurrentView("dashboard")} style={{ cursor: 'pointer' }}>
              <img src="/logo-white.svg" alt="Logo" style={{ height: '100%', width: 'auto' }} />
            </div>
            <div className="title-section">
              <h1>DCU Dashboard</h1>
              <div className="connection-status">
                {isConnected ? (
                  <>
                    <Wifi size={16} />
                    <span>Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff size={16} />
                    <span>Disconnected</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <nav className="nav-section desktop-nav">
            <button
              className={`nav-btn ${currentView === "dashboard" ? "active" : ""} ${darkMode ? "dark" : ""}`}
              onClick={() => setCurrentView("dashboard")}
            >
              <Activity size={22} />
              <span>DASHBOARD</span>
            </button>
            <button
              className={`nav-btn ${currentView === "graphs" ? "active" : ""} ${darkMode ? "dark" : ""}`}
              onClick={() => setCurrentView("graphs")}
            >
              <BarChart3 size={22} />
              <span>GRAPHS</span>
            </button>
            <button
              className={`nav-btn ${currentView === "history" ? "active" : ""} ${darkMode ? "dark" : ""}`}
              onClick={() => setCurrentView("history")}
            >
              <History size={22} />
              <span>HISTORY</span>
            </button>
            <button
              className={`nav-btn ${currentView === "reports" ? "active" : ""} ${darkMode ? "dark" : ""}`}
              onClick={() => setCurrentView("reports")}
            >
              <BarChart2 size={22} />
              <span>REPORTS</span>
            </button>
          </nav>

          <div className="header-actions">
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              <Menu size={20} />
            </button>
            <button className="theme-toggle" onClick={toggleTheme}>
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="mobile-nav">
            <button
              className={`mobile-nav-btn ${currentView === "dashboard" ? "active" : ""} ${darkMode ? "dark" : ""}`}
              onClick={() => {
                setCurrentView("dashboard")
                setMobileMenuOpen(false)
              }}
            >
              <Activity size={18} />
              <span>DASHBOARD</span>
            </button>
            <button
              className={`mobile-nav-btn ${currentView === "graphs" ? "active" : ""} ${darkMode ? "dark" : ""}`}
              onClick={() => {
                setCurrentView("graphs")
                setMobileMenuOpen(false)
              }}
            >
              <BarChart3 size={18} />
              <span>GRAPHS</span>
            </button>
            <button
              className={`mobile-nav-btn ${currentView === "history" ? "active" : ""} ${darkMode ? "dark" : ""}`}
              onClick={() => {
                setCurrentView("history")
                setMobileMenuOpen(false)
              }}
            >
              <History size={18} />
              <span>HISTORY</span>
            </button>
            <button
              className={`mobile-nav-btn ${currentView === "reports" ? "active" : ""} ${darkMode ? "dark" : ""}`}
              onClick={() => {
                setCurrentView("reports")
                setMobileMenuOpen(false)
              }}
            >
              <BarChart2 size={18} />
              <span>REPORTS</span>
            </button>
          </div>
        )}
      </header>

      <style jsx>{`
        .header {
          background: #005286;
          backdrop-filter: blur(20px);
          border-bottom: 1px solid rgba(34, 197, 94, 0.2);
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.5rem 1rem;
          max-width: 1400px;
          margin: 0 auto;
          flex-wrap: wrap; /* allow wrapping on smaller screens */
          gap: 0.5rem; /* add gap between wrapped items */
        }

        .logo-section {
          display: flex;
          align-items: center;
          gap: 1rem; /* reduced gap for smaller screens */
          flex: 1 1 200px; /* allow shrinking and growing with a base width */
          min-width: 150px; /* added margin to push logo section further right */
        }

        .logo {
          height: 40px; /* fixed height for better control */
          width: auto;
          border-radius: 0;
          background: none;
          display: inline-block;
          align-items: unset;
          justify-content: unset;
          color: unset;
          box-shadow: none;
          cursor: pointer;
        }

        .title-section {
          display: flex;
          margin-left: 1rem;
          flex-direction: column;
          justify-content: center;
          min-width: 0;
        }

        .title-section h1 {
          margin: 0;
          font-size: 1.3rem;
          font-weight: 700;
          background: white;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .connection-status {
          display: flex;
          align-items: center;
          gap: 0.3rem;
          font-size: 0.75rem;
          margin-top: 0.15rem;
          opacity: 0.8;
          color: silver;
          white-space: nowrap;
        }

        .desktop-nav {
          display: flex;
          gap: 2rem;
          flex: 2 1 400px;
          justify-content: flex-end; /* changed from center to flex-end to move buttons right */
          flex-wrap: wrap;
          min-width: 200px;
          margin-left: 2rem; /* added margin-left to push nav further right */
        }
        .nav-btn span {
          font-size: 0.9rem;
        }

        .nav-btn {
          position: relative;
          display: flex;
          align-items: center;
          gap: 0.7rem;
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 10px;
          background: transparent;
          cursor: pointer;
          font-weight: 800;
          color: white;
          font-family: inherit;
          overflow: hidden;
          transition: color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease;
          white-space: nowrap;
        }

        .nav-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0) 80%);
          transition: left 0.4s ease;
          z-index: 0;
          border-radius: 10px;
        }

        .nav-btn:hover {
          color: white;
          transform: scale(1.05);
          box-shadow: 0 0 8px white;
        }
        .nav-btn.dark:hover {
          color: white;
          background: transparent;
          box-shadow: none;
        }
        .nav-btn.dark.active {
          color: black;
          background: white;
          box-shadow: none;
          font-weight: 700;
        }

        .nav-btn:hover::before {
          left: 0;
        }

        .nav-btn.active {
          color: black;
          font-weight: 700;
          box-shadow: 0 0 12px white;
          background: white;
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex: 1 1 100px;
          justify-content: flex-end;
          min-width: 100px;
        }

        .mobile-menu-btn {
          display: none;
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 12px;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          cursor: pointer;
          transition: all 0.3s ease;
          align-items: center;
          justify-content: center;
          font-family: inherit;
        }

        .theme-toggle {
          width: 40px;
          height: 40px;
          border: none;
          border-radius: 12px;
          background: rgba(34, 197, 94, 0.1);
          color: #22c55e;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: inherit;
        }

        .theme-toggle:hover, .mobile-menu-btn:hover {
          background: rgba(34, 197, 94, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(172, 197, 182, 0.3);
        }

        .mobile-nav {
          display: none;
          flex-direction: column;
          padding: 1rem;
          border-top: 1px solid rgba(185, 191, 187, 0.2);
          background: #f5f9f6;
          backdrop-filter: blur(20px);
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 101;
        }

        .mobile-nav-btn {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: none;
          border-radius: 10px;
          background: transparent;
          cursor: pointer;
          transition: all 0.3s ease;
          font-weight: 500;
          color: black;
          text-align: left;
          font-family: inherit;
          white-space: nowrap;
        }

        .mobile-nav-btn:hover {
          background: rgb(245, 249, 246);
        }

        .mobile-nav-btn.active {
          background: rgb(245, 249, 246);
          color: #4ade80; /* lighter green */
        }

        .mobile-nav-btn svg {
          stroke: currentColor;
        }

        @media (max-width: 768px) {
          .header-content {
            padding: 0.5rem;
            gap: 0.25rem;
          }
          
          .desktop-nav {
            display: none;
          }
          
          .mobile-menu-btn {
            display: flex;
          }
          
          .mobile-nav {
            display: flex;
            position: static;
            padding: 0.5rem 1rem;
            border-top: none;
            background: transparent;
            backdrop-filter: none;
          }
          
          .title-section h1 {
            font-size: 1.1rem;
            white-space: normal;
          }
          
          .logo {
            width: 35px;
            height: 35px;
          }
          
          .theme-toggle, .mobile-menu-btn {
            width: 35px;
            height: 35px;
          }
          
          .connection-status {
            font-size: 0.7rem;
            gap: 0.2rem;
            margin-top: 0.1rem;
          }
        }

        @media (max-width: 480px) {
          .header-content {
            justify-content: space-between;
            gap: 0.5rem;
            align-items: center;
          }

          .logo-section {
            flex-direction: row;
            align-items: center;
            gap: 0.5rem;
            flex: 0 0 auto;
            min-width: auto;
          }

          .title-section {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-width: 0;
            margin: 0 1rem;
          }

          .title-section h1 {
            font-size: 1rem;
            text-align: center;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            margin: 0;
          }

          .connection-status {
            font-size: 0.65rem;
            margin-top: 0.15rem;
            justify-content: center;
          }

          .header-actions {
            flex: 0 0 auto;
            justify-content: flex-end;
            margin-top: 0;
          }
        }
      `}</style>
    </>
  )
}
