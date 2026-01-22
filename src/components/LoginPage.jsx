import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function LoginPage() {
  const { login, isAuthenticated, isAdmin } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  // Redirect if already authenticated
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      await login(email, password)
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container">
      {/* Left Panel - Hero Image */}
      <div className="hero-panel">
        <img
          src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1920&q=80"
          alt="Modern skyscrapers"
          className="hero-image"
        />
        <div className="hero-overlay" />
        <div className="hero-accent" />
      </div>

      {/* Right Panel - Login Form */}
      <div className="form-panel">
        <div className="form-pattern" />

        <form className="login-form" onSubmit={handleSubmit}>
          {/* Logo - Using Image */}
          <div className="logo-container">
            <img
              src="/logo.png"
              alt="RePrime Group"
              style={{
                maxWidth: '280px',
                height: 'auto',
                marginBottom: '24px'
              }}
            />
            <p className="portal-label">Investor Portal</p>
          </div>

          {/* Welcome Text */}
          <div className="welcome-text">
            <h2>Sign in to get started</h2>
          </div>

          {/* Error Message */}
          {error && <div className="error-message">{error}</div>}

          {/* Email Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="email">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              className="form-input"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>

          {/* Password Field */}
          <div className="form-group">
            <label className="form-label" htmlFor="password">
              Password
            </label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Sign In Button */}
          <button
            type="submit"
            className={`submit-btn ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? '' : 'Sign In'}
          </button>

          {/* Footer */}
          <div className="form-footer">
            <p>Secure investor access • Protected by encryption</p>
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage
