"use client"

import { useData } from "./data-context"
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Power,
  Navigation,
  Thermometer,
  Shield,
  Settings,
} from "lucide-react"

export default function EnhancedStatusCards({ showOnlyStatusGroups = false, showOnlySensorHealth = false, showOnlyTemperature = false }) {
  const { currentData } = useData()

  if (!currentData.status615) return null

  const statusGroups = [
    {
      title: "Vehicle Control",
      icon: Navigation,
      color: "#22c55e",
      items: [
        { key: "Forward", label: "Forward", value: currentData.status615.Forward },
        { key: "Reverse", label: "Reverse", value: currentData.status615.Reverse },
        { key: "Neutral", label: "Neutral", value: currentData.status615.Neutral },
        { key: "Brake", label: "Brake", value: currentData.status615.Brake },
      ],
    },
    {
      title: "Drive Modes",
      icon: Settings,
      color: "#8b5cf6",
      items: [
        { key: "EcoPost", label: "Eco Mode", value: currentData.status615.EcoPost },
        { key: "RegeMode", label: "Regen Mode", value: currentData.status615.RegeMode },
        { key: "ThrotMode", label: "Throttle Mode", value: currentData.status615.ThrotMode },
        { key: "AscMode", label: "ASC Mode", value: currentData.status615.AscMode },
      ],
    },
    {
      title: "Safety Systems",
      icon: Shield,
      color: "#ef4444",
      items: [
        { key: "LimpHomeMode", label: "Limp Home", value: currentData.status615.LimpHomeMode },
        { key: "HillholdMode", label: "Hill Hold", value: currentData.status615.HillholdMode },
        { key: "StartStop", label: "Start/Stop", value: currentData.status615.StartStop },
        { key: "IdleShutdown", label: "Idle Shutdown", value: currentData.status615.IdleShutdown },
      ],
    },
    {
      title: "System Control",
      icon: Power,
      color: "#f59e0b",
      items: [
        { key: "PcModeEnable", label: "PC Mode", value: currentData.status615.PcModeEnable },
        { key: "DcuControlModeStatus", label: "DCU Control", value: currentData.status615.DcuControlModeStatus },
      ],
    },
  ]

  const sensorHealthItems = [
    { key: "SnsrHealthStatus", label: "Overall Status" },
    { key: "SnsrHealthStatusDcBus", label: "DC Bus" },
    { key: "SnsrHealthStatus12V", label: "12V Supply" },
    { key: "SnsrHealthStatus5V", label: "5V Supply" },
    { key: "SnsrHealthStatusPhBCurr", label: "Phase B Current" },
    { key: "SnsrHealthStatusPhCCurr", label: "Phase C Current" },
    { key: "SnsrHealthStatusThrot1", label: "Throttle 1" },
    { key: "SnsrHealthStatusThrot2", label: "Throttle 2" },
    { key: "SnsrHealthStatusQep", label: "Encoder" },
    { key: "SnsrHealthStatusCtlrTemp1", label: "Controller Temp 1" },
    { key: "SnsrHealthStatusCtlrTemp2", label: "Controller Temp 2" },
    { key: "SnsrHealthStatusMtrTemp", label: "Motor Temp" },
  ]

  const temperatures = currentData.temp616
    ? [
        { key: "CtlrTemp1", label: "Controller 1", value: currentData.temp616.CtlrTemp1, unit: "°C" },
        { key: "CtlrTemp2", label: "Controller 2", value: currentData.temp616.CtlrTemp2, unit: "°C" },
        { key: "CtlrTemp", label: "Controller Avg", value: currentData.temp616.CtlrTemp, unit: "°C" },
        { key: "MtrTemp", label: "Motor", value: currentData.temp616.MtrTemp, unit: "°C" },
      ]
    : []

  const getHealthyCount = () => {
    return sensorHealthItems.filter((item) => currentData.status615[item.key]).length
  }

  const getTemperatureStatus = (temp) => {
    if (temp > 70) return "critical"
    if (temp > 50) return "warning"
    return "normal"
  }

  return (
    <div className="enhanced-status-cards">
      {/* Status Groups */}
      {(showOnlyStatusGroups || (!showOnlySensorHealth && !showOnlyTemperature)) && (
        <div className="status-groups">
          {statusGroups.map((group) => {
            const IconComponent = group.icon
            return (
        <div key={group.title} className="status-group">
          <div className="group-header" style={{ color: group.color }}>
            <IconComponent size={20} />
            <h4>{group.title}</h4>
          </div>
          <div className="group-items">
            {group.items.map((item) => (
              <div key={item.key} className={`status-item ${item.value ? "active" : "inactive"}`}>
                <span className="item-label">{item.label}</span>
                <div className={`status-indicator ${item.value ? "on" : "off"}`}>
                  {item.value ? <CheckCircle size={14} /> : <XCircle size={14} />}
                </div>
              </div>
            ))}
          </div>
        </div>
            )
          })}
        </div>
      )}

      {/* Sensor Health Overview */}
      {(showOnlySensorHealth || (!showOnlyStatusGroups && !showOnlyTemperature)) && (
        <div className="sensor-health-section">
          <div className="section-header">
            <Shield size={20} />
            <h3>Sensor Health Status</h3>
            <div className="health-summary">
              <span className="healthy-count">{getHealthyCount()}/{sensorHealthItems.length}</span>
              <span className="health-label">Healthy</span>
            </div>
          </div>

          <div className="sensor-grid">
            {sensorHealthItems.map((sensor) => {
              const isHealthy = currentData.status615[sensor.key]
              return (
                <div key={sensor.key} className={`sensor-item ${isHealthy ? "healthy" : "unhealthy"}`}>
                  <span className="sensor-label">{sensor.label}</span>
                  <div className={`sensor-status ${isHealthy ? "ok" : "error"}`}>
                    {isHealthy ? <CheckCircle size={12} /> : <XCircle size={12} />}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Temperature Monitoring */}
      {(showOnlyTemperature || (!showOnlyStatusGroups && !showOnlySensorHealth)) && (
        <div className="temperature-section">
          <div className="section-header">
            <Thermometer size={20} />
            <h3>Temperature Monitoring</h3>
          </div>

          <div className="temp-grid">
            {temperatures.map((temp) => {
              const status = getTemperatureStatus(temp.value)
              let IconComponent = CheckCircle
              if (status === "critical" || status === "warning") {
                IconComponent = AlertTriangle
              }
              // Add specific icons for each label if needed
              if (temp.label.toLowerCase().includes("controller")) {
                IconComponent = Power
              }
              if (temp.label.toLowerCase().includes("motor")) {
                IconComponent = Thermometer
              }
              return (
                <div key={temp.key} className={`temp-card ${status}`}>
                  <div className="temp-header">
                    <IconComponent size={20} style={{ marginRight: "0.5rem", color: status === "critical" ? "#ef4444" : status === "warning" ? "#f59e0b" : "#22c55e" }} />
                    <span className="temp-label">{temp.label}</span>
                    <div className={`temp-status-icon ${status}`}>
                      {status === "critical" ? (
                        <AlertTriangle size={16} />
                      ) : status === "warning" ? (
                        <AlertTriangle size={16} />
                      ) : (
                        <CheckCircle size={16} />
                      )}
                    </div>
                  </div>
                  <div className="temp-value">
                    <span className="value">{temp.value.toFixed(1)}</span>
                    <span className="unit">{temp.unit}</span>
                  </div>
                  <div className="temp-bar">
                    <div
                      className={`temp-fill ${status}`}
                      style={{ width: `${Math.min((temp.value / 100) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <style jsx>{`
        .enhanced-status-cards {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 2rem;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .status-groups {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.5rem;
        }

        .status-group {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 3px solid #495e70;
          border-radius: 16px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .status-group:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(34, 197, 94, 0.15);
        }

        .group-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .group-header h4 {
          margin: 0;
          font-size: 1rem;
        }

        .group-items {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .status-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          border-radius: 8px;
          transition: all 0.3s ease;
        }

        .status-item.active {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.8);
        }

        .status-item.inactive {
          background: rgba(107, 114, 128, 0.1);
          border: 1px solid rgba(107, 114, 128, 0.3);
          opacity: 0.7;
        }

        .item-label {
          font-size: 0.9rem;
          font-weight: 500;
        }

        .status-indicator {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .status-indicator.on {
          color: #22c55e;
        }

        .status-indicator.off {
          color: #6b7280;
        }

        .sensor-health-section, .temperature-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 3px solid #495e70;
          border-radius: 16px;
          padding: 1.5rem;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          margin-bottom: 1.5rem;
          color: #22c55e;
        }

        .section-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 600;
          flex: 1;
        }

        .health-summary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .healthy-count {
          font-size: 1.2rem;
          font-weight: 700;
          color: #22c55e;
        }

        .health-label {
          font-size: 0.8rem;
          opacity: 0.8;
        }

        .sensor-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 0.5rem;
        }

        .sensor-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0.75rem;
          border-radius: 6px;
          font-size: 0.8rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          cursor: default;
        }

        .sensor-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 20px rgba(34, 197, 94, 0.3);
        }

        .sensor-item.healthy {
          background: rgba(34, 197, 94, 0.2);
          border: 1px solid rgba(34, 197, 94, 0.8);
        }

        .sensor-item.unhealthy {
          background: rgba(239, 68, 68, 0.2);
          border: 1px solid rgba(239, 68, 68, 0.3);
        }

        .sensor-status.ok {
          color: #22c55e;
        }

        .sensor-status.error {
          color: #ef4444;
        }

        .temp-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .temperature-section {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(20px);
          border: 3px solid #495e70;
          border-radius: 16px;
          padding: 1.5rem;
          width: 1100px;
          margin-left: auto;
          margin-right: auto;
        }

        .temp-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 1rem;
        }

        .temp-card {
          padding: 0.5rem 2.5rem;
          border-radius: 12px;
          border: 1px solid;
          font-size: 1.2rem;
          font-weight: 700;
        }

        .temp-value .value {
          font-weight: 700;
          font-size: 1.5rem;
        }

        .temp-card.normal {
          background: rgba(34, 197, 94, 0.05);
          border-color: rgba(34, 197, 94, 0.3);
        }

        .temp-card.warning {
          background: rgba(245, 158, 11, 0.05);
          border-color: rgba(245, 158, 11, 0.3);
        }

        .temp-card.critical {
          background: rgba(239, 68, 68, 0.05);
          border-color: rgba(239, 68, 68, 0.3);
        }
      `}</style>
    </div>
  )
}
