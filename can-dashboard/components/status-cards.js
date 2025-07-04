"use client"

import { useData } from "./data-context"
import { CheckCircle, XCircle, Thermometer, Gauge } from "lucide-react"

export default function StatusCards() {
  const { currentData } = useData()

  if (!currentData.status615) return null

  const criticalStatus = [
    { key: "LimpHomeMode", label: "Limp Mode", icon: XCircle },
    { key: "Brake", label: "Brake", icon: CheckCircle },
    { key: "Forward", label: "Forward", icon: CheckCircle },
    { key: "Reverse", label: "Reverse", icon: CheckCircle },
  ]

  const temperatures = currentData.temp616
    ? [
        { key: "CtlrTemp1", label: "Controller 1", value: currentData.temp616.CtlrTemp1 },
        { key: "CtlrTemp2", label: "Controller 2", value: currentData.temp616.CtlrTemp2 },
        { key: "MtrTemp", label: "Motor", value: currentData.temp616.MtrTemp },
      ]
    : []

  const measurements = currentData.measurement617
    ? [
        { key: "DcBusVolt", label: "DC Bus Voltage", value: currentData.measurement617.DcBusVolt, unit: "V" },
        { key: "Mtrspd", label: "Motor Speed", value: currentData.measurement617.Mtrspd, unit: "RPM" },
        { key: "AcCurrMeaRms", label: "AC Current", value: currentData.measurement617.AcCurrMeaRms, unit: "A" },
      ]
    : []

  return (
    <div className="status-cards">
      <div className="card-section">
        <h3>Critical Status</h3>
        <div className="cards-grid">
          {criticalStatus.map(({ key, label, icon: Icon }) => (
            <div key={key} className={`status-card ${currentData.status615[key] ? "active" : "inactive"}`}>
              <Icon size={24} />
              <span>{label}</span>
              <div className={`indicator ${currentData.status615[key] ? "on" : "off"}`}></div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-section">
        <h3>Temperature Monitoring</h3>
        <div className="cards-grid">
          {temperatures.map(({ key, label, value }) => (
            <div key={key} className="temp-card">
              <Thermometer size={24} />
              <div className="temp-info">
                <span className="temp-label">{label}</span>
                <span className="temp-value">{value?.toFixed(1)}°C</span>
              </div>
              <div className={`temp-indicator ${value > 60 ? "hot" : value > 40 ? "warm" : "cool"}`}></div>
            </div>
          ))}
        </div>
      </div>

      <div className="card-section">
        <h3>Key Measurements</h3>
        <div className="cards-grid">
          {measurements.map(({ key, label, value, unit }) => (
            <div key={key} className="measurement-card">
              <Gauge size={24} />
              <div className="measurement-info">
                <span className="measurement-label">{label}</span>
                <span className="measurement-value">
                  {value?.toFixed(2)} {unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .status-cards {
          margin-bottom: 2rem;
        }

        .card-section {
          margin-bottom: 2rem;
        }

        .card-section h3 {
          margin-bottom: 1rem;
          font-size: 1.2rem;
          font-weight: 600;
          color: #22c55e;
        }

        .cards-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .status-card, .temp-card, .measurement-card {
          padding: 1.5rem;
          border-radius: 16px;
          backdrop-filter: blur(20px);
          border: 1px solid rgba(34, 197, 94, 0.2);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          gap: 1rem;
          position: relative;
          overflow: hidden;
        }

        .status-card {
          background: rgba(34, 197, 94, 0.05);
        }

        .status-card.active {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.4);
          box-shadow: 0 8px 25px rgba(34, 197, 94, 0.2);
        }

        .status-card.inactive {
          background: rgba(107, 114, 128, 0.1);
          border-color: rgba(107, 114, 128, 0.3);
          opacity: 0.7;
        }

        .temp-card {
          background: rgba(59, 130, 246, 0.05);
          border-color: rgba(59, 130, 246, 0.2);
        }

        .measurement-card {
          background: rgba(168, 85, 247, 0.05);
          border-color: rgba(168, 85, 247, 0.2);
        }

        .status-card:hover, .temp-card:hover, .measurement-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 35px rgba(34, 197, 94, 0.3);
        }

        .indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          margin-left: auto;
        }

        .indicator.on {
          background: #22c55e;
          box-shadow: 0 0 10px rgba(34, 197, 94, 0.6);
        }

        .indicator.off {
          background: #6b7280;
        }

        .temp-info, .measurement-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .temp-label, .measurement-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .temp-value, .measurement-value {
          font-size: 1.2rem;
          font-weight: 600;
          margin-top: 0.25rem;
        }

        .temp-indicator {
          width: 8px;
          height: 40px;
          border-radius: 4px;
          margin-left: auto;
        }

        .temp-indicator.cool {
          background: linear-gradient(to top, #3b82f6, #60a5fa);
        }

        .temp-indicator.warm {
          background: linear-gradient(to top, #f59e0b, #fbbf24);
        }

        .temp-indicator.hot {
          background: linear-gradient(to top, #ef4444, #f87171);
        }

        @media (max-width: 768px) {
          .cards-grid {
            grid-template-columns: 1fr;
          }
          
          .status-card, .temp-card, .measurement-card {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  )
}
