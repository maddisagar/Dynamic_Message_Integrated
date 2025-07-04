import { useState, useEffect, useRef, useContext } from "react"
import { useData } from "./data-context"
import Header from "./header"
import GraphContainer from "./graph-container"
import HistoryView from "./history-view"
import dynamic from "next/dynamic"
import React, { Suspense } from "react"
import { FooterContext } from "./FooterContext"

const ReportsSection = dynamic(() => import("./reports-section.jsx"), { ssr: false })
import { Activity, BarChart3, Grid3X3 } from "lucide-react"
import SystemAlerts from "./system-alerts"
import PerformanceMetrics from "./performance-metrics"
import EnhancedStatusCards from "./enhanced-status-cards"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)

export default function Dashboard() {
  const { setFixed } = useContext(FooterContext)
  const [darkMode, setDarkMode] = useState(false) 
  const [currentView, setCurrentView] = useState("dashboard") // dashboard, graphs, history, reports
  const [dashboardTab, setDashboardTab] = useState("performance") // performance, vehicleControl, driveModes, safetySystems, systemControl, sensor, temperature

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedView = localStorage.getItem("currentView")
      if (savedView) {
        setCurrentView(savedView)
      }
    }
  }, [])

  // Removed body class toggling for footer fixed as footer is now always fixed
  const [graphMode, setGraphMode] = useState("individual") // individual, overlay, quad
  const { isConnected } = useData()

  const toggleTheme = () => {
    setDarkMode(!darkMode)
  }

  useEffect(() => {
    gsap.to(window, {
      scrollTo: { y: 0, autoKill: false },
      duration: 2.0,
      ease: "power4.out",
      overwrite: "auto",
    })

    ScrollTrigger.create({
      trigger: "body",
      start: "top top",
      end: "bottom bottom",
      scrub: 1,
    })
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("currentView", currentView)
    }
  }, [currentView])

  return (
    <div className={`app ${darkMode ? "dark" : "light"}`}>
      <Header
        darkMode={darkMode}
        toggleTheme={toggleTheme}
        isConnected={isConnected}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <main className="main-content" style={{ padding: "1rem 2rem" }}>
        {currentView === "dashboard" && (
          <>
            <div className="dashboard-tabs">
              <button
                className={`tab-btn ${dashboardTab === "performance" ? "active" : ""}`}
                onClick={() => setDashboardTab("performance")}
              >
                Performance Metrics
              </button>
              <button
                className={`tab-btn ${dashboardTab === "vehicle" ? "active" : ""}`}
                onClick={() => setDashboardTab("vehicle")}
              >
              Vehicle Control & Drive Modes
              </button>
              <button
                className={`tab-btn ${dashboardTab === "sensor" ? "active" : ""}`}
                onClick={() => setDashboardTab("sensor")}
              >
                Sensor Health Status
              </button>
            <button
              className={`tab-btn ${dashboardTab === "temperature" ? "active" : ""}`}
              onClick={() => setDashboardTab("temperature")}
            >
              Temperature Monitoring
            </button>
            <button
              className={`tab-btn ${dashboardTab === "alerts" ? "active" : ""}`}
              onClick={() => setDashboardTab("alerts")}
            >
              System Alerts
            </button>
          </div>

          {dashboardTab === "performance" && <PerformanceMetrics />}
          {dashboardTab === "vehicle" && <EnhancedStatusCards showOnlyStatusGroups={true} />}
          {dashboardTab === "sensor" && <EnhancedStatusCards showOnlySensorHealth={true} />}
          {dashboardTab === "temperature" && <EnhancedStatusCards showOnlyTemperature={true} />}
          {dashboardTab === "alerts" && <SystemAlerts />}
        </>
        )}

        {currentView === "graphs" && (
          <>
            <div className="graph-controls">
              <button
                className={`control-btn ${graphMode === "individual" ? "active" : ""}`}
                onClick={() => setGraphMode("individual")}
              >
                <BarChart3 size={12} />
                Individual
              </button>
              <button
                className={`control-btn ${graphMode === "overlay" ? "active" : ""}`}
                onClick={() => setGraphMode("overlay")}
              >
                <Activity size={12} />
                Overlay
              </button>
              <button
                className={`control-btn ${graphMode === "quad" ? "active" : ""}`}
                onClick={() => setGraphMode("quad")}
              >
                <Grid3X3 size={12} />
                Quad View
              </button>
            </div>
            <GraphContainer mode={graphMode} darkMode={darkMode} />
          </>
        )}

        {currentView === "history" && <HistoryView />}

        {currentView === "reports" && (
          <Suspense fallback={<div>Loading report section...</div>}>
            <ReportsSection />
          </Suspense>
        )}
      </main>

      <style jsx>{`
        .dashboard-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 2.5rem;
          flex-wrap: wrap;
        }

        .tab-btn {
          background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 12px;
          cursor: pointer;
          font-weight: 700;
          color: #333;
          white-space: nowrap;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          position: relative;
          overflow: hidden;
          user-select: none;
          transform-origin: center;
        }

        .tab-btn::before {
          content: "";
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(120deg, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0) 80%);
          transform: skewX(-20deg);
          transition: left 0.5s ease;
          pointer-events: none;
          z-index: 1;
        }

        .tab-btn:hover::before {
          left: 100%;
        }

        .tab-btn:hover {
          box-shadow: 0 8px 15px rgba(34, 197, 94, 0.4);
          color: ##009164;
          transform: scale(1.05);
        }

        .tab-btn.active {
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.7);
          transform: scale(1.1);
          z-index: 2;
        }

        .graph-controls {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .control-btn {
          background: rgb(247, 249, 248);
          border: 1px solid rgb(0, 0, 0);
          padding: 0.25rem 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: background-color 0.3s ease;
          white-space: nowrap;
          font-size: 1rem;
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }

        .control-btn:hover {
          background: rgba(34, 197, 94, 0.2);
        }

        .control-btn.active {
          background: #22c55e;
          color: white;
        }

        /* Dark mode styles for control buttons */
        .app.dark .control-btn {
          background: #333;
          border: 1px solid #ccc;
          color: #eee;
        }

        .app.dark .control-btn:hover {
          background: rgba(34, 197, 94, 0.3);
        }

        .app.dark .control-btn.active {
          background: #22c55e;
          color: white;
        }

        @media (max-width: 768px) {
          .dashboard-tabs {
            flex-direction: column;
            gap: 0.5rem;
          }

          .tab-btn {
            width: 100%;
            padding: 0.75rem 1rem;
            font-size: 1rem;
          }

          .graph-controls {
            flex-direction: column;
            gap: 0.5rem;
          }

          .control-btn {
            width: 100%;
            padding: 0.5rem 1rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  )
}
