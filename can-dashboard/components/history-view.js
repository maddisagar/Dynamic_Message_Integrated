"use client"

import { useState, useEffect } from "react"
import { useData } from "./data-context"
import { Download, Search } from "lucide-react"
import jsPDF from "jspdf"
import { calculateAlerts } from "./data-context"

export default function HistoryView() {
  const { history } = useData()
  const [searchTerm, setSearchTerm] = useState("")
  // Remove category filter since only error alerts are shown
  // const [selectedCategory, setSelectedCategory] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [exportFormat, setExportFormat] = useState("json") // new state for export format
  const [now, setNow] = useState(Date.now()) // state to trigger re-render for dynamic time update
  const itemsPerPage = 20

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now())
    }, 1000) // update every second

    return () => clearInterval(interval)
  }, [])

  // Remove categories array since category filter is removed
  // const categories = [
  //   { value: "all", label: "All Data" },
  //   { value: "status615", label: "Status (0x615)" },
  //   { value: "temp616", label: "Temperature (0x616)" },
  //   { value: "measurement617", label: "Measurements (0x617)" },
  // ]

  // First filter items that have critical or warning alerts
  const filteredByAlerts = history.filter((item) => {
    const alerts = calculateAlerts(item)
    return alerts.some(alert => alert.type === "critical" || alert.type === "warning")
  })

  // Then filter by search term on the reduced set
  const filteredHistory = filteredByAlerts.filter((item) => {
    const searchLower = searchTerm.toLowerCase()
    return (
      searchTerm === "" ||
      item.timestamp.toLowerCase().includes(searchLower) ||
      (item.status615 && Object.values(item.status615).some(val => String(val).toLowerCase().includes(searchLower))) ||
      (item.temp616 && Object.values(item.temp616).some(val => String(val).toLowerCase().includes(searchLower))) ||
      (item.measurement617 && Object.values(item.measurement617).some(val => String(val).toLowerCase().includes(searchLower)))
    )
  })

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedHistory = filteredHistory.slice(startIndex, startIndex + itemsPerPage)

  const exportData = () => {
    if (exportFormat === "json") {
      const dataStr = JSON.stringify(filteredHistory, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)
      const link = document.createElement("a")
      link.href = url
      link.download = `can-data-${new Date().toISOString().split("T")[0]}.json`
      link.click()
      URL.revokeObjectURL(url)
    } else if (exportFormat === "pdf") {
      exportPDF()
    }
  }

  const exportPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(12)
    doc.text("CAN Data History", 10, 10)
    let y = 20
    filteredHistory.forEach((item, index) => {
      if (y > 280) {
        doc.addPage()
        y = 10
      }
      doc.text(`${index + 1}. Timestamp: ${new Date(item.timestamp).toLocaleString()}`, 10, y)
      y += 7
      if (item.status615) {
        doc.text("  Status (0x615):", 10, y)
        y += 7
        Object.entries(item.status615).forEach(([key, value]) => {
          doc.text(`    ${key}: ${value}`, 10, y)
          y += 7
        })
      }
      if (item.temp616) {
        doc.text("  Temperature (0x616):", 10, y)
        y += 7
        Object.entries(item.temp616).forEach(([key, value]) => {
          doc.text(`    ${key}: ${value}`, 10, y)
          y += 7
        })
      }
      if (item.measurement617) {
        doc.text("  Measurements (0x617):", 10, y)
        y += 7
        Object.entries(item.measurement617).forEach(([key, value]) => {
          doc.text(`    ${key}: ${value}`, 10, y)
          y += 7
        })
      }
      y += 5
    })
    doc.save(`can-data-${new Date().toISOString().split("T")[0]}.pdf`)
  }

  const renderDataSection = (data, title, category) => {
    // Remove category filter check since category filter is removed
    // if (selectedCategory !== "all" && selectedCategory !== category) return null
    if (!data) return null

    return (
      <div className="data-section">
        <h4>{title}</h4>
        <div className="data-grid">
          {Object.entries(data).map(([key, value]) => (
            <div key={key} className="data-item">
              <span className="data-key">{key}:</span>
              <span className="data-value">
                {typeof value === "boolean"
                  ? value
                    ? "ON"
                    : "OFF"
                  : typeof value === "number"
                    ? value.toFixed(2)
                    : value}
              </span>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="history-view">
      <div className="history-header">
        <h2>Data History</h2>
        <div className="history-controls">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Search by timestamp..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Remove category filter dropdown since only error alerts are shown */}
          {/* <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="category-filter"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>
                {cat.label}
              </option>
            ))}
          </select> */}

          <select
            value={exportFormat}
            onChange={(e) => setExportFormat(e.target.value)}
            className="category-filter"
            aria-label="Select export format"
          >
            <option value="json">Export JSON</option>
            <option value="pdf">Export PDF</option>
          </select>

          <button className="export-btn" onClick={exportData}>
            <Download size={16} />
            Export
          </button>
        </div>
      </div>

      <div className="history-stats">
        <div className="stat-card">
          <span className="stat-value">{filteredHistory.length}</span>
          <span className="stat-label">Total Critical/Warning Alerts</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{totalPages}</span>
          <span className="stat-label">Pages</span>
        </div>
      </div>

      <div className="history-content">
        {paginatedHistory.map((item, index) => (
          <div key={index} className="history-item">
            <div className="item-header">
              <span className="timestamp">{new Date(item.timestamp).toLocaleString()}</span>
              <span className="item-index">#{startIndex + index + 1}</span>
            </div>

            <div className="item-content">
              {(() => {
                const alerts = calculateAlerts(item).filter(alert => alert.type === "critical" || alert.type === "warning")
                if (alerts.length === 0) return null
                return (
                  <div className="alerts-list">
                    {alerts.map(alert => (
                      <div key={alert.id} className={`alert-item alert-${alert.type}`}>
                        <strong>{alert.category}:</strong> {alert.message}
                      </div>
                    ))}
                  </div>
                )
              })()}
            </div>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
            Previous
          </button>

          <div className="page-numbers">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              const pageNum = Math.max(1, currentPage - 2) + i
              if (pageNum > totalPages) return null

              return (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={currentPage === pageNum ? "active" : ""}
                >
                  {pageNum}
                </button>
              )
            })}
          </div>

          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}

      <style jsx>{`
        .history-view {
          padding: 2rem 0;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        }

        .history-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .history-header h2 {
          margin: 0;
          color: #22c55e;
          font-size: 1.5rem;
        }

        .history-controls {
          display: flex;
          gap: 1rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 8px;
          padding: 0.5rem;
        }

        .search-box input {
          background: transparent;
          border: none;
          color: inherit;
          outline: none;
          width: 200px;
          font-family: inherit;
        }

        .category-filter {
          padding: 0.5rem;
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: inherit;
          font-family: inherit;
        }

        .export-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 600;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .export-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(34, 197, 94, 0.4);
        }

        .history-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 12px;
          padding: 1rem;
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #22c55e;
        }

        .stat-label {
          font-size: 0.9rem;
          opacity: 0.8;
        }

        .history-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .history-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(34, 197, 94, 0.2);
          border-radius: 12px;
          padding: 1.5rem;
          transition: all 0.3s ease;
        }

        .history-item:hover {
          border-color: rgba(34, 197, 94, 0.4);
          box-shadow: 0 8px 25px rgba(34, 197, 94, 0.1);
        }

        .item-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid rgba(34, 197, 94, 0.2);
        }

        .timestamp {
          font-weight: 600;
          color: #22c55e;
        }

        .item-index {
          font-size: 0.9rem;
          opacity: 0.7;
        }

        .item-content {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .data-section h4 {
          margin: 0 0 0.5rem 0;
          color: #22c55e;
          font-size: 1rem;
        }

        .data-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 0.5rem;
        }

        .data-item {
          display: flex;
          justify-content: space-between;
          padding: 0.25rem 0;
          font-size: 0.9rem;
        }

        .data-key {
          opacity: 0.8;
        }

        .data-value {
          font-weight: 600;
        }

        .pagination {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          margin-top: 2rem;
        }

        .pagination button {
          padding: 0.5rem 1rem;
          border: 1px solid rgba(34, 197, 94, 0.3);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.05);
          color: inherit;
          cursor: pointer;
          transition: all 0.3s ease;
          font-family: inherit;
        }

        .pagination button:hover:not(:disabled) {
          background: rgba(34, 197, 94, 0.1);
          border-color: rgba(34, 197, 94, 0.5);
        }

        .pagination button.active {
          background: #22c55e;
          color: white;
        }

        .pagination button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .page-numbers {
          display: flex;
          gap: 0.5rem;
        }

        @media (max-width: 768px) {
          .history-header {
            flex-direction: column;
            align-items: stretch;
          }
          
          .history-controls {
            justify-content: center;
          }
          
          .search-box input {
            width: 150px;
          }
          
          .data-grid {
            grid-template-columns: 1fr;
          }
          
          .pagination {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </div>
  )
}
