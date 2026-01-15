function LoginPage({ onLogin }) {
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
        
        <div className="login-form">
          {/* Logo */}
          <div className="logo-container">
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

            <p className="portal-label">Investor Portal</p>
          </div>

          {/* Welcome Text */}
          <div className="welcome-text">
            <h2>Sign in to get started</h2>
          </div>

          {/* Sign In Button */}
          <button 
            className="submit-btn"
            onClick={onLogin}
          >
            Sign In
          </button>

          {/* Footer */}
          <div className="form-footer">
            <p>Secure investor access • Protected by encryption</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
