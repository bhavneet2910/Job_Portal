import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import './App.css'
import Jobs from './components/Jobs'
import Home from './components/Home'
import JobDescription from './components/JobDescription'
import Login from './components/auth/Login'
import Signup from './components/auth/Signup'
import Profile from './components/Profile'
import PostJob from './components/PostedJobs'
import Companies from './components/Companies'
import CompanySetup from './components/CompanySetup'
import CompanyCreate from './components/CompanyCreate'
import Browse from './components/Browse'
import CreateJobs from './components/admin/CreateJobs'
import ProtectedRoute from './components/admin/ProtectedRoute'
import Applicants from './components/admin/Applicants'
import AuthInitializer from './components/auth/AuthInitializer'

const appRouter = createBrowserRouter([
  {
    path: "/",
    element: <ProtectedRoute><Home /></ProtectedRoute>
  },
  {
    path: "/Home",
    element: <ProtectedRoute><Home /></ProtectedRoute>
  },
  {
    path: "/jobs",
    element: <Jobs />
  },
  {
    path: "/description/:id",
    element: <ProtectedRoute><JobDescription /></ProtectedRoute>
  },
  {
    path: "/browse",
    element: <Browse />
  },
  {
    path: "/login",
    element: <Login />
  },
  {
    path: "/signup",
    element: <Signup />
  },
  {
    path: "/profile",
    element: <ProtectedRoute><Profile /></ProtectedRoute>
  },
  // Admin Dashboard Routes
  {
    path: "/admin/jobs",
    element: <ProtectedRoute><PostJob /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/create",
    element: <ProtectedRoute><CreateJobs /></ProtectedRoute>
  },
  {
    path: "/admin/jobs/:id/applicants",
    element: <ProtectedRoute><Applicants /></ProtectedRoute>
  },
  {
    path: "/admin/companies",
    element: <ProtectedRoute><Companies /></ProtectedRoute>
  },
  {
    path: "/admin/companies/create",
    element: <ProtectedRoute><CompanyCreate /></ProtectedRoute>
  },
  {
    path: "/admin/companies/:id",
    element: <ProtectedRoute><CompanySetup /></ProtectedRoute>
  },
])

function App() {
  return (
    <>
      <AuthInitializer />
      <RouterProvider router={appRouter} />
    </>
  )
}

export default App