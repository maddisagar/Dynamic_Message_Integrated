"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

export default function CustomDropdown({ options, value, onChange, label, darkMode = true }) {
  const [isOpen, setIsOpen] = useState(false)

  const selectedOption = options.find((opt) => opt.value === value)

  return (
    <div className="dropdown-container">
      {label && <label className="dropdown-label">{label}</label>}
      <div className="dropdown-wrapper">
        <button className={`dropdown-button ${darkMode ? "dark" : "light"}`} onClick={() => setIsOpen(!isOpen)} type="button">
          <span>{selectedOption?.label || "Select option"}</span>
          <ChevronDown size={16} className={`dropdown-icon ${isOpen ? "open" : ""}`} />
        </button>

        {isOpen && (
          <div className={`dropdown-menu ${darkMode ? "dark" : "light"}`}>
            {options.map((option) => (
              <button
                key={option.value}
                className={`dropdown-option ${option.value === value ? "selected" : ""} ${darkMode ? "dark" : "light"}`}
                onClick={() => {
                  onChange(option.value)
                  setIsOpen(false)
                }}
                type="button"
              >
                {option.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        .dropdown-container {
          position: relative;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .dropdown-label {
          display: block;
          font-weight: 600;
          color: #22c55e;
          font-size: 0.9rem;
          margin-bottom: 0.5rem;
        }

        .dropdown-wrapper {
          position: relative;
        }

        .dropdown-button {
          width: 100%;
          padding: 0.5rem;
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: inherit;
          font-size: 0.9rem;
          font-family: inherit;
          display: flex;
          justify-content: space-between;
          align-items: center;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dropdown-button.dark {
          color: #eee;
        }

        .dropdown-button:hover {
          border-color: rgba(34, 197, 94, 0.5);
          background: rgba(255, 255, 255, 0.08);
        }

        .dropdown-icon {
          transition: transform 0.3s ease;
        }

        .dropdown-icon.open {
          transform: rotate(180deg);
        }

        .dropdown-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 1000;
          border-radius: 8px;
          margin-top: 0.25rem;
          max-height: 200px;
          overflow-y: auto;
          backdrop-filter: blur(20px);
        }

        .dropdown-menu.light {
          background: rgba(255, 255, 255, 0.82);
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .dropdown-menu.dark {
          background: rgba(0, 0, 0, 0.8);
          border: 1px solid rgba(34, 197, 94, 0.6);
        }

        .dropdown-option {
          width: 100%;
          padding: 0.5rem;
          border: none;
          background: transparent;
          font-size: 0.9rem;
          font-family: inherit;
          text-align: left;
          cursor: pointer;
          transition: all 0.3s ease;
        }

        .dropdown-option.light {
          color: inherit;
        }

        .dropdown-option.dark {
          color: #eee;
        }

        .dropdown-option:hover {
          background: rgba(34, 197, 94, 0.1);
        }

        .dropdown-option.selected {
          background: rgba(34, 197, 94, 0.2);
          color: #22c55e;
        }
      `}</style>
    </div>
  )
}
