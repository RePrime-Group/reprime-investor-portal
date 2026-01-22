import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { DASHBOARD_URL } from '../App'

function Dashboard() {
  const { user, logout } = useAuth()
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    // Auto-redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = DASHBOARD_URL
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleManualRedirect = () => {
    window.location.href = DASHBOARD_URL
  }

  return (
    <div className="welcome-screen">
      {/* Logo */}
      <div className="logo-container" style={{ marginBottom: '48px' }}>
        <div className="logo-mark">
          <div className="logo-bars">
            <div className="logo-bar" />
            <div className="logo-bar" />
            <div className="logo-bar" />
          </div>
          <h1 className="logo-text">RePrime</h1>
        </div>

        <div className="logo-group">
          {['G', 'R', 'O', 'U', 'P'].map((letter, i) => (
            <span key={i}>{letter}</span>
          ))}
        </div>
      </div>

      <div className="welcome-message">
        <h1>Welcome, {user?.name || user?.email}</h1>
        <p>You have been authenticated successfully.</p>
      </div>

      <p className="redirect-notice">
        Redirecting to your dashboard in {countdown} seconds...
      </p>

      <a
        href={DASHBOARD_URL}
        className="manual-redirect"
        onClick={(e) => {
          e.preventDefault()
          handleManualRedirect()
        }}
      >
        Go to Dashboard Now
      </a>

      <button className="logout-btn" onClick={logout}>
        Sign Out
      </button>
    </div>
  )
}

export default Dashboard
