import { useAuth } from '../context/AuthContext'

function Dashboard() {
  const { user, logout } = useAuth()

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

      <button className="logout-btn" onClick={logout}>
        Sign Out
      </button>
    </div>
  )
}

export default Dashboard
