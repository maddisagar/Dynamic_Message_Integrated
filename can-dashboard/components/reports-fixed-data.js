const generateFixedReportData = () => {
  const startDate = new Date("2025-06-01")
  const endDate = new Date()
  const data = {}

  // Helper function to generate pseudo-random but fixed values based on date
  const getValue = (base, offset) => base + (offset % 10)

  for (
    let d = new Date(startDate);
    d <= endDate;
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = d.toISOString().slice(0, 10)
    const dayOffset = d.getDate() + d.getMonth() + d.getFullYear()

    data[dateStr] = {
      criticalAlertsCount: getValue(5, dayOffset),
      systemModesCounts: {
        regenMode: getValue(20, dayOffset + 1),
        ascMode: getValue(15, dayOffset + 2),
        hillHold: getValue(10, dayOffset + 3),
        limp: getValue(3, dayOffset + 4),
        idleShutdown: (getValue(50, dayOffset + 5) % 100), // percentage 0-99
      },
      temperatureStats: {
        minMotorTemp: getValue(30, dayOffset + 6),
        maxMotorTemp: getValue(80, dayOffset + 7),
        minControllerTemp: getValue(25, dayOffset + 8),
        maxControllerTemp: getValue(70, dayOffset + 9),
      },
    }
  }

  return data
}

const fixedDailyReports = generateFixedReportData()

export default fixedDailyReports
