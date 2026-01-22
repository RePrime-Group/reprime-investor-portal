import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

function AdminRoute({ children }) {
  const { isAuthenticated, isAdmin, loading } = useAuth()

  if (loading) {
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

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />
  }

  return children
}

export default AdminRoute
