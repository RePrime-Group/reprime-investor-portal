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
          {/* Logo - Using Image */}
          <div className="logo-container">
            {/* 
              OPTION 1: Use a logo image file
              Upload your logo to the /public folder and reference it like this:
            */}
            <img 
              src="/logo.png" 
              alt="RePrime Group" 
              style={{
                maxWidth: '280px',
                height: 'auto',
                marginBottom: '24px'
              }}
            />
            
            {/* 
              OPTION 2: Use a hosted logo URL
              If your logo is hosted somewhere, use the full URL:
              
              <img 
                src="https://your-website.com/logo.png" 
                alt="RePrime Group" 
                style={{
                  maxWidth: '280px',
                  height: 'auto',
                  marginBottom: '24px'
                }}
              />
            */}

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
