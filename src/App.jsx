import { useState, useEffect } from 'react'
import netlifyIdentity from 'netlify-identity-widget'
import LoginPage from './components/LoginPage'
import Dashboard from './components/Dashboard'

// ============================================================
// CONFIGURATION - EDIT THIS URL TO YOUR DASHBOARD
// ============================================================
const DASHBOARD_URL = 'https://your-deals-dashboard.com'
// ============================================================

function App() {
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Initialize Netlify Identity
    netlifyIdentity.init()

    // Check if user is already logged in
    const currentUser = netlifyIdentity.currentUser()
    if (currentUser) {
      setUser(currentUser)
    }
    setIsLoading(false)

    // Listen for login events
    netlifyIdentity.on('login', (user) => {
      setUser(user)
      netlifyIdentity.close()
    })

    // Listen for logout events
    netlifyIdentity.on('logout', () => {
      setUser(null)
    })

    // Cleanup
    return () => {
      netlifyIdentity.off('login')
      netlifyIdentity.off('logout')
    }
  }, [])

  const handleLogin = () => {
    netlifyIdentity.open('login')
  }

  const handleLogout = () => {
    netlifyIdentity.logout()
  }

  if (isLoading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#fdfcfa'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '3px solid #e8e6e0',
          borderTopColor: '#b8a369',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
      </div>
    )
  }

  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} dashboardUrl={DASHBOARD_URL} />
  }

  return <LoginPage onLogin={handleLogin} />
}

export default App
