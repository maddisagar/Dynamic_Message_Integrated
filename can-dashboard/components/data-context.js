"use client"

import { createContext, useContext, useState, useEffect, useMemo } from "react"

const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error("useData must be used within a DataProvider")
  }
  return context
}

const getWebSocketUrl = () => {
  return "ws://192.168.137.57"
}

function parseWebSocketData(rawData) {
  try {
    const parsedData = typeof rawData === "string" ? JSON.parse(rawData) : rawData

    const mappedData = {
      timestamp: new Date().toISOString(),
      status615: {},
      temp616: {},
      measurement617: {},
      faults: {},
    }

    // Define keys for each category
    const statusKeys = [
      "EcoBoost", "LimpHomeMode", "Brake", "Forward", "Reverse", "Neutral", "HillholdMode", "RegenMode",
      "ThrotMode", "AscMode", "SnsrHealthStatus", "SnsrHealthStatusDcBus", "SnsrHealthStatus12V",
      "SnsrHealthStatus5V", "SnsrHealthStatusPhBCurr", "SnsrHealthStatusPhCCurr", "SnsrHealthStatusThrot1",
      "SnsrHealthStatusQep", "SnsrHealthStatusCtlrTemp1", "SnsrHealthStatusMtrTemp", "SnsrHealthStatusThrot2",
      "SnsrHealthStatusCtlrTemp2", "PcModeEnable", "StartStop", "DcuControlModeStatus", "IdleShutdown"
    ]

    const tempKeys = ["CtlrTemp1", "CtlrTemp2", "CtlrTemp", "MtrTemp"]

    const measurementKeys = ["AcCurrMeaRms", "DcCurrEstd", "DcBusVolt", "MtrSpd", "ThrotVolt"]

    const faultKeys = [
      "CanErr", "DcBusOvErr", "DcBusSnrScFlt", "DcBusUvErr", "MtrTempCutbackLmtErr", "CtlrTempCutbackLmtErr",
      "MtrTempCutoffLmtErr", "CtlrTempCutoffLmtErr", "MtrTempSnsrOcFlt", "CtlrTempSnsrOcFlt", "MtrTempSnsrScFlt",
      "CtlrTempSnsrScFlt", "PhBCurrSnsrOverCurrFlt", "PhBCurrSnsrScCurrFlt", "PhBCurrSnsrScFlt", "DcBusSnsrOcFlt",
      "PhBCurrSnsrOcFlt", "PhCCurrSnsrOcFlt", "PhCCurrSnsrOverCurrFlt", "PhCCurrSnsrScCurrFlt", "PhCCurrSnsrScFlt",
      "QepFlt", "SocLowLmtErr", "ThrotLowLmtErr", "ThrotRedunErr", "ThrotStuckErr", "ThrotUpLmtErr",
      "UnexpectedParkSenseHighErr", "UnintendedAccelerationErr", "UnintendedDecelerationErr", "ThrotSnsrOcFlt",
      "ThrotSnsrScFlt", "FnrErr", "FnrWarn", "Supply12SnsrOcFlt", "Supply5SnsrOcFlt", "Supply12UvErr", "Supply5UvErr",
      "HwOverCurrFlt", "Type_0_Err", "Type_1_Err", "Type_2_Err", "Type_3_Err", "Type_4_Err", "QepFlt_2",
      "PhACurrSnsrOverCurrFlt", "PhACurrSnsrScCurrFlt", "DcBusLvErr"
    ]

    // Assign values to mappedData based on keys
    for (const key of statusKeys) {
      mappedData.status615[key] = parsedData[key] !== undefined ? parsedData[key] : false
    }

    for (const key of tempKeys) {
      mappedData.temp616[key] = parsedData[key] !== undefined ? Number.parseFloat(parsedData[key]) || 0 : 0
    }

    for (const key of measurementKeys) {
      mappedData.measurement617[key] = parsedData[key] !== undefined ? Number.parseFloat(parsedData[key]) || 0 : 0
    }

    for (const key of faultKeys) {
      mappedData.faults[key] = parsedData[key] !== undefined ? parsedData[key] : false
    }

    return mappedData
  } catch (error) {
    console.error("Error parsing WebSocket data:", error)
    return null
  }
}

// Sample fallback data for when WebSocket is not connected
const sampleWebSocketData = {
  timestamp: new Date().toISOString(),
  status615: {
    EcoBoost: true,
    LimpHomeMode: false,
    Brake: true,
    Forward: true,
    Reverse: false,
    Neutral: true,
    HillholdMode: false,
    RegenMode: true,
    ThrotMode: false,
    AscMode: true,
    SnsrHealthStatus: true,
    SnsrHealthStatusDcBus: true,
    SnsrHealthStatus12V: true,
    SnsrHealthStatus5V: true,
    SnsrHealthStatusPhBCurr: true,
    SnsrHealthStatusPhCCurr: true,
    SnsrHealthStatusThrot1: true,
    SnsrHealthStatusQep: true,
    SnsrHealthStatusCtlrTemp1: true,
    SnsrHealthStatusMtrTemp: true,
    SnsrHealthStatusThrot2: true,
    SnsrHealthStatusCtlrTemp2: true,
    PcModeEnable: true,
    StartStop: false,
    DcuControlModeStatus: true,
    IdleShutdown: false,
  },
  temp616: {
    CtlrTemp1: 45.3,
    CtlrTemp2: 47.8,
    CtlrTemp: 46.5,
    MtrTemp: 55.2,
  },
  measurement617: {
    AcCurrMeaRms: 65.4,
    DcCurrEstd: 40.2,
    DcBusVolt: 350.7,
    MtrSpd: 1800,
    ThrotVolt: 3.2,
  },
  faults: {},
}

export function calculateAlerts(currentData) {
  if (!currentData.temp616 || !currentData.measurement617 || !currentData.status615) return []

  const newAlerts = []
  const timestamp = new Date().toLocaleString()

  // Temperature alerts
  if (currentData.temp616.MtrTemp > 70) {
    newAlerts.push({
      id: `motor-temp-${Date.now()}`,
      type: "critical",
      category: "Temperature",
      message: `Motor temperature critical: ${currentData.temp616.MtrTemp.toFixed(1)}°C`,
      timestamp,
      value: currentData.temp616.MtrTemp,
      threshold: 70,
    })
  }

  if (currentData.temp616.CtlrTemp1 > 65 || currentData.temp616.CtlrTemp2 > 65) {
    newAlerts.push({
      id: `controller-temp-${Date.now()}`,
      type: "warning",
      category: "Temperature",
      message: `Controller temperature high: ${Math.max(currentData.temp616.CtlrTemp1, currentData.temp616.CtlrTemp2).toFixed(1)}°C`,
      timestamp,
      value: Math.max(currentData.temp616.CtlrTemp1, currentData.temp616.CtlrTemp2),
      threshold: 65,
    })
  }

  // Voltage alerts
  if (currentData.measurement617.DcBusVolt > 450 || currentData.measurement617.DcBusVolt < 250) {
    newAlerts.push({
      id: `voltage-${Date.now()}`,
      type: currentData.measurement617.DcBusVolt > 450 ? "critical" : "warning",
      category: "Electrical",
      message: `DC Bus voltage ${currentData.measurement617.DcBusVolt > 450 ? "overvoltage" : "undervoltage"}: ${currentData.measurement617.DcBusVolt.toFixed(1)}V`,
      timestamp,
      value: currentData.measurement617.DcBusVolt,
      threshold: currentData.measurement617.DcBusVolt > 450 ? 450 : 250,
    })
  }

  // Current alerts
  if (currentData.measurement617.AcCurrMeaRms > 80) {
    newAlerts.push({
      id: `current-${Date.now()}`,
      type: "warning",
      category: "Electrical",
      message: `AC Current high: ${currentData.measurement617.AcCurrMeaRms.toFixed(1)}A`,
      timestamp,
      value: currentData.measurement617.AcCurrMeaRms,
      threshold: 80,
    })
  }

  // System status alerts
  if (currentData.status615.LimpHomeMode) {
    newAlerts.push({
      id: `limp-mode-${Date.now()}`,
      type: "critical",
      category: "System",
      message: "Vehicle in Limp Home Mode",
      timestamp,
      value: "ACTIVE",
      threshold: "OFF",
    })
  }

  // Sensor health alerts
  const sensorHealthIssues = Object.entries(currentData.status615)
    .filter(([key, value]) => key.startsWith("SnsrHealthStatus") && !value)
    .map(([key]) => key.replace("SnsrHealthStatus", ""))

  if (sensorHealthIssues.length > 0) {
    newAlerts.push({
      id: `sensor-health-${Date.now()}`,
      type: "warning",
      category: "Sensors",
      message: `Sensor health issues: ${sensorHealthIssues.join(", ")}`,
      timestamp,
      value: sensorHealthIssues.length,
      threshold: 0,
    })
  }

  // Fault alerts from DTFS001_Type
  if (currentData.faults) {
    Object.entries(currentData.faults).forEach(([faultKey, faultValue]) => {
      if (faultValue) {
        newAlerts.push({
          id: `fault-${faultKey}-${Date.now()}`,
          type: "critical",
          category: "Fault",
          message: `System fault detected: ${faultKey}`,
          timestamp,
          value: "ACTIVE",
          threshold: "OFF",
        })
      }
    })
  }

  return newAlerts
}

export const DataProvider = ({ children }) => {
  const [currentData, setCurrentData] = useState(sampleWebSocketData)
  const [history, setHistory] = useState([sampleWebSocketData])
  const [dailyReports, setDailyReports] = useState(() => {
    // Load from localStorage if available
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("dailyReports")
      if (stored) {
        return JSON.parse(stored)
      } else {
        // Generate sample data from 2026-06-20 to today
        const startDate = new Date("2026-06-20")
        const today = new Date()
        const reports = {}
        for (let d = new Date(startDate); d <= today; d.setDate(d.getDate() + 1)) {
          const dateStr = d.toISOString().slice(0, 10)
          reports[dateStr] = {
            criticalAlertsCount: Math.floor(Math.random() * 50),
            systemModesCounts: {
              regenMode: Math.floor(Math.random() * 100),
              ascMode: Math.floor(Math.random() * 100),
              hillHold: Math.floor(Math.random() * 100),
              limp: Math.floor(Math.random() * 50),
              idleShutdown: Math.floor(Math.random() * 100),
            },
            temperatureStats: {
              minMotorTemp: (Math.random() * 20 + 40).toFixed(1),
              maxMotorTemp: (Math.random() * 20 + 60).toFixed(1),
              minControllerTemp: (Math.random() * 20 + 30).toFixed(1),
              maxControllerTemp: (Math.random() * 20 + 60).toFixed(1),
            },
          }
        }
        return reports
      }
    }
    return {}
  })
  const [isConnected, setIsConnected] = useState(false)

  // Save dailyReports to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("dailyReports", JSON.stringify(dailyReports))
    }
  }, [dailyReports])

  // Aggregate daily report from history for a given date (YYYY-MM-DD)
  const aggregateDailyReport = (date) => {
    if (!history || history.length === 0) return null
    const dayData = history.filter((item) => item.timestamp.startsWith(date))
    if (dayData.length === 0) return null

    const criticalAlertsCount = dayData.reduce((count, item) => {
      return count + (item.status615?.LimpHomeMode ? 1 : 0)
    }, 0)

    const systemModesCounts = {
      regenMode: dayData.reduce((sum, item) => sum + (item.status615?.RegenMode ? 1 : 0), 0),
      ascMode: dayData.reduce((sum, item) => sum + (item.status615?.AscMode ? 1 : 0), 0),
      hillHold: dayData.reduce((sum, item) => sum + (item.status615?.HillholdMode ? 1 : 0), 0),
      limp: dayData.reduce((sum, item) => sum + (item.status615?.LimpHomeMode ? 1 : 0), 0),
      idleShutdown: dayData.reduce((sum, item) => sum + (item.status615?.IdleShutdown ? 1 : 0), 0),
    }

    const motorTemps = dayData.map((item) => item.temp616?.MtrTemp).filter((t) => typeof t === "number")
    const controllerTemps1 = dayData.map((item) => item.temp616?.CtlrTemp1).filter((t) => typeof t === "number")
    const controllerTemps2 = dayData.map((item) => item.temp616?.CtlrTemp2).filter((t) => typeof t === "number")

    const minMotorTemp = motorTemps.length ? Math.min(...motorTemps) : null
    const maxMotorTemp = motorTemps.length ? Math.max(...motorTemps) : null

    const minControllerTemp =
      controllerTemps1.length && controllerTemps2.length
        ? Math.min(Math.min(...controllerTemps1), Math.min(...controllerTemps2))
        : null
    const maxControllerTemp =
      controllerTemps1.length && controllerTemps2.length
        ? Math.max(Math.max(...controllerTemps1), Math.max(...controllerTemps2))
        : null

    return {
      criticalAlertsCount,
      systemModesCounts,
      temperatureStats: {
        minMotorTemp,
        maxMotorTemp,
        minControllerTemp,
        maxControllerTemp,
      },
    }
  }

  // Update daily report for current day at midnight or on demand
  useEffect(() => {
    const updateDailyReport = () => {
      const today = new Date().toISOString().slice(0, 10)
      const report = aggregateDailyReport(today)
      if (report) {
        setDailyReports((prev) => ({ ...prev, [today]: report }))
      }
    }

    updateDailyReport()

    const now = new Date()
    const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime()

    const timeoutId = setTimeout(() => {
      updateDailyReport()
      setInterval(updateDailyReport, 24 * 60 * 60 * 1000)
    }, msUntilMidnight)

    return () => {
      clearTimeout(timeoutId)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [history])

  // Function to get report by date or date range
  const getReportsByDateRange = (startDate, endDate) => {
    if (!startDate || !endDate) return null
    const reports = {}
    const currentDate = new Date(startDate)
    const lastDate = new Date(endDate)
    while (currentDate <= lastDate) {
      const dateStr = currentDate.toISOString().slice(0, 10)
      if (dailyReports[dateStr]) {
        reports[dateStr] = dailyReports[dateStr]
      }
      currentDate.setDate(currentDate.getDate() + 1)
    }
    return reports
  }

  useEffect(() => {
    let ws
    let reconnectInterval = 1000
    let intervalId
    let reconnectTimeoutId

    const connect = () => {
      const url = getWebSocketUrl()
      console.log(`Attempting to connect to WebSocket: ${url}`)
      ws = new WebSocket(url)

      ws.onopen = () => {
        setIsConnected(true)
        console.log("WebSocket connected to ESP32:", url)
        reconnectInterval = 1000 // reset reconnect interval on successful connection
      }

      ws.onmessage = (event) => {
        try {
          console.log("Raw WebSocket data received:", event.data)
          const parsedData = parseWebSocketData(event.data)

          if (parsedData) {
            console.log("Parsed WebSocket data:", parsedData)
            setCurrentData(parsedData)
            setHistory((prev) => {
              const updated = [...prev, parsedData]
              return updated.slice(-100) // Keep last 100 entries
            })
          }
        } catch (error) {
          console.error("Error processing WebSocket data:", error)
        }
      }

      ws.onclose = (event) => {
        setIsConnected(false)
        console.log("WebSocket disconnected. Code:", event.code, "Reason:", event.reason)
        console.log("Attempting to reconnect in", reconnectInterval, "ms...")

        reconnectTimeoutId = setTimeout(() => {
          reconnectInterval = Math.min(reconnectInterval * 2, 30000) // exponential backoff max 30s
          connect()
        }, reconnectInterval)
      }

      ws.onerror = (event) => {
        console.warn("WebSocket error:", event)
        setIsConnected(false)
      }
    }

    // Initial connection attempt
    connect()

    // Fallback data generation when WebSocket is not connected
    intervalId = setInterval(() => {
      if (!ws || ws.readyState !== WebSocket.OPEN) {
        // Generate mock data when WebSocket is not connected
        setCurrentData((prevData) => {
          const newData = {
            ...prevData,
            timestamp: new Date().toISOString(),
            status615: Object.fromEntries(
              Object.entries(prevData.status615).map(([key, value]) => [key, Math.random() > 0.5 ? !value : value]),
            ),
            temp616: {
              CtlrTemp1: Math.max(20, Math.min(80, prevData.temp616.CtlrTemp1 + (Math.random() * 2 - 1))),
              CtlrTemp2: Math.max(20, Math.min(80, prevData.temp616.CtlrTemp2 + (Math.random() * 2 - 1))),
              CtlrTemp: Math.max(20, Math.min(80, prevData.temp616.CtlrTemp + (Math.random() * 2 - 1))),
              MtrTemp: Math.max(20, Math.min(100, prevData.temp616.MtrTemp + (Math.random() * 2 - 1))),
            },
            measurement617: {
              AcCurrMeaRms: Math.max(0, Math.min(100, prevData.measurement617.AcCurrMeaRms + (Math.random() * 2 - 1))),
              DcCurrEstd: Math.max(0, Math.min(100, prevData.measurement617.DcCurrEstd + (Math.random() * 2 - 1))),
              DcBusVolt: Math.max(200, Math.min(500, prevData.measurement617.DcBusVolt + (Math.random() * 2 - 1))),
              MtrSpd: Math.min(Math.max(prevData.measurement617.MtrSpd + Math.floor(Math.random() * 21 - 10), 0), 3000),
              ThrotVolt: Math.max(0, Math.min(5, prevData.measurement617.ThrotVolt + (Math.random() * 0.2 - 0.1))),
            },
          }

          setHistory((prevHistory) => {
            const updated = [...prevHistory, newData]
            return updated.slice(-100)
          })
          return newData
        })
      }
    }, 2000) // Update every 2 seconds when not connected

    return () => {
      if (ws) {
        ws.close()
      }
      clearInterval(intervalId)
      if (reconnectTimeoutId) {
        clearTimeout(reconnectTimeoutId)
      }
    }
  }, [])

  const alerts = useMemo(() => calculateAlerts(currentData), [currentData])

  return (
    <DataContext.Provider
      value={{
        currentData,
        history,
        dailyReports,
        isConnected,
        alerts,
        getReportsByDateRange,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
