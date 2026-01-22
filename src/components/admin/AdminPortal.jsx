import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { listUsers, deleteUser } from '../../lib/auth'
import UserTable from './UserTable'
import UserForm from './UserForm'

function AdminPortal() {
  const { user, logout } = useAuth()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await listUsers()
      setUsers(data.users)
    } catch (err) {
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleCreate = () => {
    setEditingUser(null)
    setShowForm(true)
  }

  const handleEdit = (userToEdit) => {
    setEditingUser(userToEdit)
    setShowForm(true)
  }

  const handleDelete = async (userToDelete) => {
    if (userToDelete.id === user.id) {
      alert('You cannot delete your own account')
      return
    }

    if (!window.confirm(`Are you sure you want to delete ${userToDelete.name}?`)) {
      return
    }

    try {
      await deleteUser(userToDelete.id)
      fetchUsers()
    } catch (err) {
      alert(err.message || 'Failed to delete user')
    }
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingUser(null)
  }

  const handleFormSuccess = () => {
    handleFormClose()
    fetchUsers()
  }

  return (
    <div className="admin-portal">
      {/* Header */}
      <header className="admin-header">
        <div className="admin-header-content">
          <div className="admin-logo">
            <img src="/logo.png" alt="RePrime Group" />
            <span className="admin-label">Admin Portal</span>
          </div>
          <div className="admin-user-info">
            <span className="admin-user-name">{user?.name}</span>
            <button className="admin-logout-btn" onClick={logout}>
              Sign Out
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="admin-main">
        <div className="admin-container">
          <div className="admin-title-row">
            <h1>User Management</h1>
            <button className="admin-btn admin-btn-primary" onClick={handleCreate}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Add User
            </button>
          </div>

          {error && <div className="admin-error">{error}</div>}

          {loading ? (
            <div className="admin-loading">
              <div className="admin-spinner" />
              <p>Loading users...</p>
            </div>
          ) : (
            <UserTable
              users={users}
              currentUserId={user?.id}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          )}
        </div>
      </main>

      {/* User Form Modal */}
      {showForm && (
        <UserForm
          user={editingUser}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  )
}

export default AdminPortal
