import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./context/AuthContext"
import Navbar from "./components/Navbar"
import Footer from "./components/Footer"
import HomePage from "./pages/HomePage"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import DelegateDashboard from "./pages/DelegateDashboard"
import ChairDashboard from "./pages/ChairDashboard"
import AdminDashboard from "./pages/AdminDashboard"
import CommitteePage from "./pages/CommitteePage"
import NotFoundPage from "./pages/NotFoundPage"
import "./index.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/delegate/dashboard" element={<DelegateDashboard />} />
              <Route path="/chair/dashboard" element={<ChairDashboard />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/committee/:id" element={<CommitteePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
