import { useState } from 'react'
import { createUser, updateUser } from '../../lib/auth'

function UserForm({ user, onClose, onSuccess }) {
  const isEditing = !!user
  const [formData, setFormData] = useState({
    name: user?.name || '',
    username: user?.username || '',
    email: user?.email || '',
    password: '',
    is_admin: user?.is_admin || false,
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      if (isEditing) {
        const updateData = {
          id: user.id,
          name: formData.name,
          username: formData.username,
          email: formData.email,
          is_admin: formData.is_admin,
        }
        // Only include password if it was changed
        if (formData.password) {
          updateData.password = formData.password
        }
        await updateUser(updateData)
      } else {
        await createUser(formData)
      }
      onSuccess()
    } catch (err) {
      setError(err.message || 'Failed to save user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="admin-modal-overlay" onClick={onClose}>
      <div className="admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="admin-modal-header">
          <h2>{isEditing ? 'Edit User' : 'Create User'}</h2>
          <button className="admin-modal-close" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <form className="admin-modal-form" onSubmit={handleSubmit}>
          {error && <div className="admin-error">{error}</div>}

          <div className="admin-form-group">
            <label htmlFor="name">Full Name</label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="John Doe"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="johndoe"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              disabled={loading}
              placeholder="john@example.com"
            />
          </div>

          <div className="admin-form-group">
            <label htmlFor="password">
              {isEditing ? 'New Password (leave blank to keep current)' : 'Password'}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required={!isEditing}
              disabled={loading}
              placeholder={isEditing ? 'Enter new password' : 'Enter password'}
            />
          </div>

          <div className="admin-form-group admin-form-checkbox">
            <label>
              <input
                name="is_admin"
                type="checkbox"
                checked={formData.is_admin}
                onChange={handleChange}
                disabled={loading}
              />
              <span>Administrator</span>
            </label>
            <p className="admin-form-hint">
              Administrators can manage users and access the admin portal.
            </p>
          </div>

          <div className="admin-modal-actions">
            <button
              type="button"
              className="admin-btn admin-btn-secondary"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="admin-btn admin-btn-primary"
              disabled={loading}
            >
              {loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Create User'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UserForm
