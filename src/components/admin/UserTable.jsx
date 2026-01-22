function UserTable({ users, currentUserId, onEdit, onDelete }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (users.length === 0) {
    return (
      <div className="admin-empty">
        <p>No users found</p>
      </div>
    )
  }

  return (
    <div className="admin-table-wrapper">
      <table className="admin-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Username</th>
            <th>Role</th>
            <th>Last Login</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <div className="admin-user-cell">
                  <span className="admin-user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </span>
                  <span>{user.name}</span>
                </div>
              </td>
              <td>{user.email}</td>
              <td>{user.username}</td>
              <td>
                <span className={`admin-badge ${user.is_admin ? 'admin-badge-admin' : 'admin-badge-user'}`}>
                  {user.is_admin ? 'Admin' : 'User'}
                </span>
              </td>
              <td>{formatDate(user.last_login_at)}</td>
              <td>
                <div className="admin-actions">
                  <button
                    className="admin-btn-icon"
                    onClick={() => onEdit(user)}
                    title="Edit user"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                    </svg>
                  </button>
                  <button
                    className="admin-btn-icon admin-btn-danger"
                    onClick={() => onDelete(user)}
                    title="Delete user"
                    disabled={user.id === currentUserId}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default UserTable
