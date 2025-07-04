"use client"

import { useState, useEffect } from "react"
import { AlertTriangle, XCircle, Bell, Thermometer, Zap, Activity } from "lucide-react"

const ERROR_LIST = [
  // DT007_B001_Status (0x615)
  { code: "EcoBoost", type: "critical", icon: Zap },
  { code: "LimpHomeMode", type: "critical", icon: AlertTriangle },
  { code: "Brake", type: "warning", icon: XCircle },
  { code: "Forward", type: "info", icon: Activity },
  { code: "Reverse", type: "info", icon: Activity },
  { code: "Neutral", type: "info", icon: Activity },
  { code: "HillholdMode", type: "warning", icon: XCircle },
  { code: "RegenMode", type: "info", icon: Activity },
  { code: "ThrotMode", type: "warning", icon: XCircle },
  { code: "AscMode", type: "info", icon: Activity },
  { code: "SnsrHealthStatus", type: "warning", icon: AlertTriangle },
  { code: "SnsrHealthStatusDcBus", type: "warning", icon: AlertTriangle },
  { code: "SnsrHealthStatus12V", type: "warning", icon: AlertTriangle },
  { code: "SnsrHealthStatus5V", type: "warning", icon: AlertTriangle },
  { code: "SnsrHealthStatusPhBCurr", type: "warning", icon: AlertTriangle },
  { code: "SnsrHealthStatusPhCCurr", type: "warning", icon: AlertTriangle },
  { code: "SnsrHealthStatusThrot1", type: "warning", icon: AlertTriangle },
  { code: "SnsrHealthStatusQep", type: "warning", icon: AlertTriangle },
  { code: "SnsrHealthStatusCtlrTemp1", type: "warning", icon: AlertTriangle },
  { code: "SnsrHealthStatusMtrTemp", type: "warning", icon: AlertTriangle },
  { code: "SnsrHealthStatusThrot2", type: "warning", icon: AlertTriangle },
  { code: "SnsrHealthStatusCtlrTemp2", type: "warning", icon: AlertTriangle },
  { code: "PcModeEnable", type: "info", icon: Activity },
  { code: "StartStop", type: "info", icon: Activity },
  { code: "DcuControlModeStatus", type: "info", icon: Activity },
  { code: "IdleShutdown", type: "info", icon: Activity },

  // DT008_B002 (0x616)
  { code: "CtlrTemp1", type: "warning", icon: Thermometer },
  { code: "CtlrTemp2", type: "warning", icon: Thermometer },
  { code: "CtlrTemp", type: "warning", icon: Thermometer },
  { code: "MtrTemp", type: "critical", icon: Thermometer },

  // DT009_B003 (0x617)
  { code: "AcCurrMeaRms", type: "warning", icon: Zap },
  { code: "DcCurrEstd", type: "warning", icon: Zap },
  { code: "DcBusVolt", type: "critical", icon: Zap },
  { code: "MtrSpd", type: "info", icon: Activity },
  { code: "ThrotVolt", type: "warning", icon: Zap },

  // DTFS001_Type (0x3)
  { code: "CanErr", type: "critical", icon: AlertTriangle },
  { code: "DcBusOvErr", type: "critical", icon: AlertTriangle },
  { code: "DcBusSnrScFlt", type: "critical", icon: AlertTriangle },
  { code: "DcBusUvErr", type: "critical", icon: AlertTriangle },
  { code: "MtrTempCutbackLmtErr", type: "critical", icon: AlertTriangle },
  { code: "CtlrTempCutbackLmtErr", type: "critical", icon: AlertTriangle },
  { code: "MtrTempCutoffLmtErr", type: "critical", icon: AlertTriangle },
  { code: "CtlrTempCutoffLmtErr", type: "critical", icon: AlertTriangle },
  { code: "MtrTempSnsrOcFlt", type: "critical", icon: AlertTriangle },
  { code: "CtlrTempSnsrOcFlt", type: "critical", icon: AlertTriangle },
  { code: "MtrTempSnsrScFlt", type: "critical", icon: AlertTriangle },
  { code: "CtlrTempSnsrScFlt", type: "critical", icon: AlertTriangle },
  { code: "PhBCurrSnsrOverCurrFlt", type: "critical", icon: AlertTriangle },
  { code: "PhBCurrSnsrScCurrFlt", type: "critical", icon: AlertTriangle },
  { code: "DcBusSnsrOcFlt", type: "critical", icon: AlertTriangle },
  { code: "PhBCurrSnsrOcFlt", type: "critical", icon: AlertTriangle },
  { code: "PhCCurrSnsrOcFlt", type: "critical", icon: AlertTriangle },
  { code: "PhCCurrSnsrOverCurrFlt", type: "critical", icon: AlertTriangle },
  { code: "PhCCurrSnsrScCurrFlt", type: "critical", icon: AlertTriangle },
  { code: "PhCCurrSnsrScFlt", type: "critical", icon: AlertTriangle },
  { code: "QepFlt", type: "critical", icon: AlertTriangle },
  { code: "SocLowLmtErr", type: "critical", icon: AlertTriangle },
  { code: "ThrotLowLmtErr", type: "critical", icon: AlertTriangle },
  { code: "ThrotRedunErr", type: "critical", icon: AlertTriangle },
  { code: "ThrotStuckErr", type: "critical", icon: AlertTriangle },
  { code: "ThrotUpLmtErr", type: "critical", icon: AlertTriangle },
  { code: "UnexpectedParkSenseHighErr", type: "critical", icon: AlertTriangle },
  { code: "UnintendedAccelerationErr", type: "critical", icon: AlertTriangle },
  { code: "UnintendedDecelerationErr", type: "critical", icon: AlertTriangle },
  { code: "ThrotSnsrOcFlt", type: "critical", icon: AlertTriangle },
  { code: "ThrotSnsrScFlt", type: "critical", icon: AlertTriangle },
  { code: "FnrErr", type: "critical", icon: AlertTriangle },
  { code: "FnrWarn", type: "warning", icon: AlertTriangle },
  { code: "Supply12SnsrOcFlt", type: "critical", icon: AlertTriangle },
  { code: "Supply5SnsrOcFlt", type: "critical", icon: AlertTriangle },
  { code: "Supply12UvErr", type: "critical", icon: AlertTriangle },
  { code: "Supply5UvErr", type: "critical", icon: AlertTriangle },
  { code: "HwOverCurrFlt", type: "critical", icon: AlertTriangle },
  { code: "Type_0_Err", type: "critical", icon: AlertTriangle },
  { code: "Type_1_Err", type: "critical", icon: AlertTriangle },
  { code: "Type_2_Err", type: "critical", icon: AlertTriangle },
  { code: "Type_3_Err", type: "critical", icon: AlertTriangle },
  { code: "Type_4_Err", type: "critical", icon: AlertTriangle },
  { code: "QepFlt_2", type: "critical", icon: AlertTriangle },
  { code: "PhACurrSnsrOverCurrFlt", type: "critical", icon: AlertTriangle },
  { code: "PhACurrSnsrScCurrFlt", type: "critical", icon: AlertTriangle },
  { code: "DcBusLvErr", type: "critical", icon: AlertTriangle },
]

function getRandomActiveErrors(errorList, maxCount = 5) {
  const count = Math.floor(Math.random() * maxCount) + 1
  const shuffled = errorList.sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count).map((error, index) => ({
    id: `${error.code}-${Date.now()}-${index}`,
    ...error,
    message: `${error.code} is active`,
    timestamp: new Date().toLocaleTimeString(),
  }))
}

export default function SystemAlerts() {
  const [activeErrors, setActiveErrors] = useState([])
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveErrors(getRandomActiveErrors(ERROR_LIST, 10))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const criticalCount = activeErrors.filter((e) => e.type === "critical").length
  const warningCount = activeErrors.filter((e) => e.type === "warning").length
  const infoCount = activeErrors.filter((e) => e.type === "info").length

  return (
    <>
      <div className="container-full" style={{ padding: "0.1rem 1rem", border: "3px solid #495e70", borderRadius: "8px", backgroundColor: "rgba(255, 255, 255, 0.05)", marginBottom: "1.5rem" }}>
        <div className="alerts-header">
          <div className="alerts-title">
            <Bell size={20} />
            <h3>System Alerts</h3>
          </div>
          <div className="alert-counts">
            {/* Removed critical, warning, and info counts from top right side */}
          </div>
        </div>

        <div className="alerts-columns-full">
          {activeErrors.length === 0 ? (
            <div className="no-alerts">
              <XCircle size={24} />
              <span>All systems operating normally</span>
            </div>
          ) : (
        <div className="alerts-columns-row" style={{ display: "flex", gap: "1rem", paddingBottom: "1rem", flexWrap: "wrap" }}>
          <div
            className="alerts-column critical"
            style={{
              flex: "1 1 300px",
              borderRight: "2px solid rgba(128, 128, 128, 0.7)",
              paddingLeft: "1rem",
              paddingRight: "1rem",
              minHeight: "auto",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              marginBottom: "1rem",
            }}
          >
            <h4 className="column-title">Critical Alerts</h4>
            {activeErrors
              .filter((alert) => alert.type === "critical")
              .map((alert) => {
                const IconComponent = alert.icon
                return (
                  <div key={alert.id} className={`alert-item ${alert.type}`}>
                    <div className="alert-icon">
                      <IconComponent size={18} />
                    </div>
                    <div className="alert-content">
                      <div className="alert-header">
                        <span className="alert-category">{alert.code}</span>
                        <span className="alert-time">{alert.timestamp}</span>
                      </div>
                      <div className="alert-message">{alert.message}</div>
                    </div>
                  </div>
                )
              })}
          </div>

          <div
            className="alerts-column warning"
            style={{
              flex: "1 1 300px",
              borderRight: "2px solid rgba(128, 128, 128, 0.7)",
              paddingLeft: "1rem",
              paddingRight: "1rem",
              minHeight: "auto",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              marginBottom: "1rem",
            }}
          >
            <h4 className="column-title">Warning Alerts</h4>
            {activeErrors
              .filter((alert) => alert.type === "warning")
              .map((alert) => {
                const IconComponent = alert.icon
                return (
                  <div key={alert.id} className={`alert-item ${alert.type}`}>
                    <div className="alert-icon">
                      <IconComponent size={18} />
                    </div>
                    <div className="alert-content">
                      <div className="alert-header">
                        <span className="alert-category">{alert.code}</span>
                        <span className="alert-time">{alert.timestamp}</span>
                      </div>
                      <div className="alert-message">{alert.message}</div>
                    </div>
                  </div>
                )
              })}
          </div>

          <div
            className="alerts-column info"
            style={{
              flex: "1 1 300px",
              paddingLeft: "1rem",
              paddingRight: "1rem",
              minHeight: "auto",
              boxSizing: "border-box",
              display: "flex",
              flexDirection: "column",
              marginBottom: "1rem",
            }}
          >
            <h4 className="column-title">Info Alerts</h4>
            {activeErrors
              .filter((alert) => alert.type === "info")
              .map((alert) => {
                const IconComponent = alert.icon
                return (
                  <div key={alert.id} className={`alert-item ${alert.type}`}>
                    <div className="alert-icon">
                      <IconComponent size={18} />
                    </div>
                    <div className="alert-content">
                      <div className="alert-header">
                        <span className="alert-category">{alert.code}</span>
                        <span className="alert-time">{alert.timestamp}</span>
                      </div>
                      <div className="alert-message">{alert.message}</div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .container-full {
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .container {
          display: flex;
          height: 100%;
          width: 100%;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .left-half {
          flex: 1;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border-radius: 16px 0 0 16px;
          display: flex;
          flex-direction: column;
          gap: 1rem;
          overflow-y: auto;
        }

        .vertical-divider {
          width: 1px;
          background-color: rgba(34, 197, 94, 0.3);
          margin: 0 1rem;
        }

        .right-half {
          flex: 1;
          padding: 1.5rem;
          background: transparent;
        }

        .alerts-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
          color: #22c55e;
          flex-wrap: wrap;
        }

        .alerts-title {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 1.2rem;
        }

        .alert-counts {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .alert-badge {
          padding: 0.2rem 0.5rem;
          border-radius: 12px;
          font-size: 0.7rem;
          font-weight: 600;
          color: white;
        }

        .alert-badge.critical {
          background: #ef4444;
        }

        .alert-badge.warning {
          background: #f59e0b;
        }

        .alert-badge.info {
          background: #22c55e;
        }

        .alerts-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          overflow-y: auto;
          max-height: calc(100vh - 150px);
        }

        .no-alerts {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          padding: 2rem;
          color: #22c55e;
          font-weight: 500;
        }

        .alerts-group {
          margin-bottom: 1rem;
        }

        .group-title {
          font-weight: 700;
          font-size: 1rem;
          margin-bottom: 0.5rem;
          color: inherit;
        }

        .alerts-group.critical .group-title {
          color: #ef4444;
        }

        .alerts-group.warning .group-title {
          color: #f59e0b;
        }

        .alerts-group.info .group-title {
          color: #22c55e;
        }

        .alert-item {
          display: flex;
          gap: 0.75rem;
          padding: 1rem;
          margin-bottom: 0.75rem;
          border-radius: 8px;
          border-left: 4px solid;
          transition: all 0.3s ease;
          cursor: default;
          background: rgba(255, 255, 255, 0.05);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.3);
        }

        .alert-item.critical {
          border-left-color: #ef4444;
        }

        .alert-item.warning {
          border-left-color: #f59e0b;
        }

        .alert-item.info {
          border-left-color: #22c55e;
        }

        .alert-item:hover {
          transform: translateX(4px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        .alert-icon {
          flex-shrink: 0;
          margin-top: 0.2rem;
          color: inherit;
        }

        .alert-content {
          flex: 1;
        }

        .alert-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.25rem;
          font-weight: 600;
          font-size: 0.9rem;
          opacity: 0.85;
        }

        .alert-category {
          font-weight: 700;
        }

        .alert-time {
          font-size: 0.75rem;
          opacity: 0.6;
        }

        .alert-message {
          font-weight: 500;
          font-size: 0.85rem;
        }

        @media (max-width: 768px) {
          .container {
            flex-direction: column;
          }

          .left-half,
          .right-half {
            border-radius: 16px;
            padding: 1rem;
          }

          .vertical-divider {
            width: 100%;
            height: 1px;
            margin: 1rem 0;
          }
        }
      `}</style>
    </>
  )
}
