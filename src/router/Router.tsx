import { Home } from "@/pages/Home"
import { Landing } from "@/pages/Landing"
import { Register } from "@/pages/Register"
import { SignIn } from "@/pages/SignIn"
import { ProtectedRoute } from "./ProtectedRoute"
import { createBrowserRouter, Navigate } from "react-router"
import { Rating } from "@/pages/Rating"

export const router = createBrowserRouter([
  { path: "/", element: <Navigate to="/landing" replace /> },
  { path: "/landing", element: <Landing /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <SignIn /> },
  {
    element: <ProtectedRoute />,
    children: [
      { path: "/home", element: <Home /> },
      { path: "/rating", element: <Rating /> },
    ],
  },
])