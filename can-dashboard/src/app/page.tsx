"use client"
import Dashboard from "@/components/dashboard"
import { DataProvider } from "@/components/data-context"

export default function Home() {
  return (
    <DataProvider>
      <Dashboard />
    </DataProvider>
  )
}
