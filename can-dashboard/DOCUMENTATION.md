# CAN Dashboard - Complete Documentation

## Project Overview

**CAN Dashboard** is a real-time CAN bus data visualization dashboard built with Next.js and React. It provides live monitoring, historical data analysis, alerts, and performance metrics for CAN bus data, typically sourced from an ESP32 device via WebSocket.

### Key Features
- Real-time data visualization with multiple graph modes
- Detailed status and health monitoring of vehicle systems
- System alerts for critical and warning conditions
- Historical data browsing with search, filter, pagination, and export (JSON/PDF)
- Dark and light theme support with responsive design

### Technology Stack
- **Framework:** Next.js 13 (React 18)
- **Styling:** Tailwind CSS, custom CSS modules
- **Animations:** GSAP (GreenSock Animation Platform)
- **Icons:** lucide-react
- **PDF Export:** jsPDF
- **Data Source:** WebSocket connection to ESP32 device (simulated fallback data)

---

## Setup and Running

### Installation

Clone the repository and install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Running Development Server

Start the Next.js development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the dashboard.

### Build and Deployment

Build the production version:

```bash
npm run build
```

Start the production server:

```bash
npm start
```

Export a static version:

```bash
npm run export
```

Deploy to GitHub Pages:

```bash
npm run deploy
```

---

## Architecture and Data Flow

### Application Structure

- **Root Layout:** Defined in `src/app/layout.tsx`, sets page metadata and wraps the app content.
- **Main Page:** `src/app/page.tsx` renders the `Dashboard` component wrapped in `DataProvider`.
- **Data Context:** `components/data-context.js` manages WebSocket connection, provides current and historical CAN data via React Context.

### Data Management

- Connects to a WebSocket URL (replace placeholder in `data-context.js`) to receive live CAN bus data.
- Maintains current data and a history buffer of the last 100 data points.
- Simulates data updates if WebSocket is disconnected for testing.

### Dashboard Component

- Manages UI state: dark mode, current view (`dashboard`, `graphs`, `history`), and graph mode (`individual`, `overlay`, `quad`).
- Renders child components based on current view and mode.

---

## Components Documentation

### Header (`components/header.js`)

- Displays app logo, title, and connection status.
- Navigation buttons to switch between Dashboard, Graphs, and History views.
- Theme toggle button for dark/light mode.
- Responsive mobile menu support.

**Props:**
- `darkMode` (boolean): current theme mode.
- `toggleTheme` (function): toggles theme.
- `isConnected` (boolean): WebSocket connection status.
- `currentView` (string): active view.
- `setCurrentView` (function): updates active view.

---

### StatusCards (`components/status-cards.js`)

- Shows critical vehicle statuses (e.g., Limp Mode, Brake).
- Displays temperature monitoring for controllers and motor.
- Shows key measurements like DC Bus Voltage, Motor Speed, AC Current.

---

### EnhancedStatusCards (`components/enhanced-status-cards.js`)

- Categorized status groups: Vehicle Control, Drive Modes, Safety Systems, System Control.
- Sensor health overview with counts and individual sensor statuses.
- Detailed temperature monitoring with status indicators.
- Live measurements with icons and values.

---

### SystemAlerts (`components/system-alerts.js`)

- Generates alerts based on thresholds and system states:
  - Critical and warning temperature alerts.
  - Voltage and current alerts.
  - Limp Home Mode and sensor health issues.
- Allows toggling alerts on/off and clearing alerts.
- Displays alert summaries and detailed alert list with timestamps.

---

### HistoryView (`components/history-view.js`)

- Displays paginated historical CAN data.
- Search by timestamp and filter by data category.
- Export data as JSON or PDF.
- Shows detailed data sections for status, temperature, and measurements.

---

### GraphContainer (`components/graph-container.js`)

- Visualizes CAN data metrics in three modes:
  - **Individual:** all metrics in separate charts.
  - **Overlay:** user-selected metrics overlaid on one chart.
  - **Quad:** four user-selected metrics in a 2x2 grid.
- Uses `Chart` and `CustomDropdown` components for rendering and selection.

---

### PerformanceMetrics (`components/performance-metrics.js`)

- Displays key performance metrics: Motor Speed, DC Bus Voltage, AC Current RMS, Motor Temperature.
- Calculates trends over recent data points.
- Computes efficiency score and power consumption.
- Visualizes metrics with progress bars and trend icons.

---

## Styling and Theming

- Uses Tailwind CSS with custom styles for components.
- Supports dark and light themes toggled via Header.
- Responsive design for desktop and mobile views.
- Uses GSAP for smooth scroll animations.

---

## Extending and Contributing

- To add new metrics or views, extend `data-context.js` to include new data fields.
- Add corresponding UI components or extend existing ones to display new data.
- Customize alert thresholds and messages in `system-alerts.js`.
- Modify graph metrics and options in `graph-container.js`.
- Follow existing styling conventions and component structure.
- Contributions are welcome via pull requests.

---

## Additional Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [GSAP Documentation](https://greensock.com/docs/)
- [lucide-react Icons](https://lucide.dev/)

---

This documentation provides a comprehensive guide to understanding, running, and extending the CAN Dashboard project. For any questions or issues, please refer to the source code or open an issue in the repository.
