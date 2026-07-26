import { RouterProvider } from "react-router"
import { router } from "./router/Router"
import { MaintenanceGate } from "./components/system/MaintenanceGate"
import { Toast } from "@heroui/react"

function App() {
  return (
    <MaintenanceGate>
      <RouterProvider router={router} />
      <Toast.Provider placement="top end" />
    </MaintenanceGate>
  )
}

export default App