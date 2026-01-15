import { useEffect, useState } from 'react'

function Dashboard({ user, onLogout, dashboardUrl }) {
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    // Auto-redirect countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          window.location.href = dashboardUrl
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [dashboardUrl])

  const handleManualRedirect = () => {
    window.location.href = dashboardUrl
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
        <h1>Welcome, {user.user_metadata?.full_name || user.email}</h1>
        <p>You have been authenticated successfully.</p>
      </div>

      <p className="redirect-notice">
        Redirecting to your dashboard in {countdown} seconds...
      </p>

      <a 
        href={dashboardUrl} 
        className="manual-redirect"
        onClick={(e) => {
          e.preventDefault()
          handleManualRedirect()
        }}
      >
        Go to Dashboard Now
      </a>

      <button className="logout-btn" onClick={onLogout}>
        Sign Out
      </button>
    </div>
  )
}

export default Dashboard
