import { useEffect, useState, type ReactNode } from 'react'
import { useAppStatusStore } from '@/store/useAppStatusStore'
import { axiosInstance } from '@/services/axios'
import { Maintenance } from '@/pages/Maintenance'

const HEALTH_CHECK_PATH = '/health'
const POLL_INTERVAL_MS = 8000

interface MaintenanceGateProps {
  children: ReactNode
}

export function MaintenanceGate({ children }: MaintenanceGateProps) {
  const isOffline = useAppStatusStore((s) => s.isOffline)
  const isServerDown = useAppStatusStore((s) => s.isServerDown)
  const isDown = isOffline || isServerDown
  const [isRetrying, setIsRetrying] = useState(false)

  const checkConnection = async () => {
    try {
      await axiosInstance.get(HEALTH_CHECK_PATH)
      window.location.reload()
    } catch {
      console.log("error")
    }
  }

  const handleRetry = async () => {
    setIsRetrying(true)
    await checkConnection()
    setIsRetrying(false)
  }

  useEffect(() => {
    if (!isDown) return
    const id = window.setInterval(checkConnection, POLL_INTERVAL_MS)
    return () => window.clearInterval(id)
  }, [isDown])

  useEffect(() => {
    const handleBrowserOffline = () => useAppStatusStore.getState().setOffline(true)
    const handleBrowserOnline = () => checkConnection()

    window.addEventListener('offline', handleBrowserOffline)
    window.addEventListener('online', handleBrowserOnline)

    if (!navigator.onLine) handleBrowserOffline()

    return () => {
      window.removeEventListener('offline', handleBrowserOffline)
      window.removeEventListener('online', handleBrowserOnline)
    }
  }, [])

  if (!isDown) return <>{children}</>

  return (
    <Maintenance
      reason={isOffline ? 'offline' : 'server'}
      onRetry={handleRetry}
      isRetrying={isRetrying}
    />
  )
}