"use client"
import { useState } from "react"
import { Menu, X, Activity, BarChart3, History, Bell } from "lucide-react"

export default function MobileNav({ currentView, setCurrentView }) {
  const [isOpen, setIsOpen] = useState(false)

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: Activity },
    { id: "graphs", label: "Graphs", icon: BarChart3 },
    { id: "history", label: "History", icon: History },
    { id: "alerts", label: "Alerts", icon: Bell },
  ]

  const toggleNav = () => {
    setIsOpen(!isOpen)
  }

  const handleNavClick = (viewId) => {
    setCurrentView(viewId)
    setIsOpen(false)
  }

  return (
    <>
      <button className="mobile-nav-toggle" onClick={toggleNav}>
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && <div className="mobile-nav-overlay" onClick={() => setIsOpen(false)} />}

      <nav className={`mobile-nav ${isOpen ? "open" : ""}`}>
        <div className="mobile-nav-header">
          <h3>Navigation</h3>
        </div>

        <div className="mobile-nav-items">
          {navItems.map((item) => {
            const IconComponent = item.icon
            return (
              <button
                key={item.id}
                className={`mobile-nav-item ${currentView === item.id ? "active" : ""}`}
                onClick={() => handleNavClick(item.id)}
              >
                <IconComponent size={20} />
                <span>{item.label}</span>
              </button>
            )
          })}
        </div>
      </nav>

      <style jsx>{`
        .mobile-nav-toggle {
          display: none;
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1001;
          width: 50px;
          height: 50px;
          border: none;
          border-radius: 12px;
          background: rgba(34, 197, 94, 0.1);
          backdrop-filter: blur(20px);
          color: #22c55e;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .mobile-nav-toggle:hover {
          background: rgba(34, 197, 94, 0.2);
          transform: scale(1.05);
        }

        .mobile-nav-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          z-index: 999;
          backdrop-filter: blur(4px);
        }

        .mobile-nav {
          position: fixed;
          top: 0;
          left: -300px;
          width: 280px;
          height: 100vh;
          background: rgba(15, 23, 42, 0.95);
          backdrop-filter: blur(20px);
          border-right: 1px solid rgba(34, 197, 94, 0.2);
          z-index: 1000;
          transition: left 0.3s ease;
          display: flex;
          flex-direction: column;
        }

        .mobile-nav.open {
          left: 0;
        }

        .mobile-nav-header {
          padding: 2rem 1.5rem 1rem;
          border-bottom: 1px solid rgba(34, 197, 94, 0.2);
        }

        .mobile-nav-header h3 {
          margin: 0;
          color: #22c55e;
          font-size: 1.2rem;
          font-weight: 600;
        }

        .mobile-nav-items {
          flex: 1;
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .mobile-nav-item {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          border: none;
          border-radius: 12px;
          background: transparent;
          color: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: 1rem;
          text-align: left;
        }

        .mobile-nav-item:hover {
          background: rgba(34, 197, 94, 0.1);
        }

        .mobile-nav-item.active {
          background: rgb(245, 249, 246);
          color: #4ade80; /* lighter green */
        }

        .mobile-nav-item svg {
          stroke: currentColor;
        }
        @media (max-width: 768px) {
          .mobile-nav-toggle {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      `}</style>
    </>
  )
}
