"use client"

import { useEffect, useState } from "react"
import { FaEdit, FaFilter, FaPlus, FaSearch, FaSpinner, FaTrash, FaUserShield } from "react-icons/fa"
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal"
import UserFormModal from "../../components/users/UserFormModal"
import "../../styles/pages/userManagement.scss"

const API_BASE_URL = "https://hqtcsdl-git-main-bui-duc-hungs-projects.vercel.app/admin"

const UserManagement = () => {
  const [users, setUsers] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showUserModal, setShowUserModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [filterRole, setFilterRole] = useState("")
  const [filterStatus, setFilterStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [roles, setRoles] = useState(["Quản trị viên", "Quản lý", "Khách hàng", "Nhân viên bán hàng", "Nhân viên kho"])

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/accounts`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const result = await response.json()

      // Kiểm tra cấu trúc dữ liệu trả về
      let usersData = []
      if (result.data && Array.isArray(result.data.accounts)) {
        // Nếu API trả về cấu trúc { data: { accounts: [...] } }
        usersData = result.data.accounts
      } else if (Array.isArray(result.data)) {
        // Nếu API trả về cấu trúc { data: [...] }
        usersData = result.data
      } else if (Array.isArray(result)) {
        // Nếu API trả về trực tiếp mảng tài khoản
        usersData = result
      }

      // Chuyển đổi dữ liệu nếu cần
      const formattedUsers = usersData.map((user) => ({
        id: user._id || user.id,
        name: user.name || user.username || "Không có tên",
        email: user.email || "Không có email",
        role: user.role || "Khách hàng",
        status: user.status || "Hoạt động",
        lastLogin: user.lastLogin || "Chưa đăng nhập",
      }))

      setUsers(formattedUsers)
    } catch (err) {
      console.error("Error fetching users:", err)
      setError("Không thể tải danh sách người dùng. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleAddUser = () => {
    setCurrentUser(null)
    setShowUserModal(true)
  }

  const handleEditUser = (user) => {
    setCurrentUser(user)
    setShowUserModal(true)
  }

  const handleDeleteClick = (user) => {
    setCurrentUser(user)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    setLoading(true)
    try {
      const userId = currentUser.id
      const response = await fetch(`${API_BASE_URL}/accounts/delete:${userId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Refresh user list after successful deletion
      fetchUsers()
      setShowDeleteModal(false)
    } catch (err) {
      console.error("Error deleting user:", err)
      setError("Không thể xóa người dùng. Vui lòng thử lại sau.")
      setLoading(false)
    }
  }

  const handleSaveUser = async (user) => {
    setLoading(true)
    try {
      let response

      // Chuẩn bị dữ liệu để gửi đi
      const userData = {
        name: user.name,
        email: user.email,
        role: user.role,
        status: user.status,
      }

      // Thêm mật khẩu nếu là tạo mới
      if (!user.id && user.password) {
        userData.password = user.password
      }

      if (user.id) {
        // Update existing user
        response = await fetch(`${API_BASE_URL}/accounts/update/${user.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
      } else {
        // Add new user
        response = await fetch(`${API_BASE_URL}/accounts/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(userData),
        })
      }

      // Log response để debug
      console.log("API Response status:", response.status)
      const responseData = await response.json().catch(() => ({}))
      console.log("API Response data:", responseData)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${responseData.message || "Unknown error"}`)
      }

      // Refresh user list after successful save
      fetchUsers()
      setShowUserModal(false)
      setError(null) // Xóa thông báo lỗi nếu có
    } catch (err) {
      console.error("Error saving user:", err)
      setError(`Không thể ${user.id ? "cập nhật" : "thêm"} người dùng. Chi tiết lỗi: ${err.message}`)
      setLoading(false)
    }
  }

  const filteredUsers = users.filter((user) => {
    return (
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === "" || user.role === filterRole) &&
      (filterStatus === "" || user.status === filterStatus)
    )
  })

  const statuses = [...new Set(users.map((u) => u.status))]

  return (
    <div className="user-management-page">
      <div className="page-header">
        <h1>Quản lý người dùng</h1>
        <button className="btn-primary" onClick={handleAddUser}>
          <FaPlus /> Thêm người dùng mới
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm người dùng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <FaFilter />
          <select value={filterRole} onChange={(e) => setFilterRole(e.target.value)}>
            <option value="">Tất cả vai trò</option>
            {roles.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-box">
          <FaFilter />
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">Tất cả trạng thái</option>
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div
          className="error-message"
          style={{
            padding: "1rem",
            marginBottom: "1rem",
            backgroundColor: "rgba(229, 62, 62, 0.1)",
            color: "var(--danger-color)",
            borderRadius: "0.375rem",
          }}
        >
          {error}
        </div>
      )}

      {loading && !showUserModal && !showDeleteModal ? (
        <div
          className="loading-container"
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "3rem",
          }}
        >
          <FaSpinner
            className="spinner"
            style={{
              fontSize: "2rem",
              color: "var(--primary-color)",
              animation: "spin 1s linear infinite",
            }}
          />
          <style jsx>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .spinner {
              animation: spin 1s linear infinite;
            }
          `}</style>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ tên</th>
                <th>Email</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Đăng nhập gần nhất</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (
                  <tr key={user.id}>
                    <td>#{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      <span
                        className={`status-badge ${user.status === "Hoạt động" ? "active" : user.status === "Không hoạt động" ? "inactive" : "blocked"}`}
                      >
                        {user.status}
                      </span>
                    </td>
                    <td>{user.lastLogin}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon edit" onClick={() => handleEditUser(user)}>
                          <FaEdit />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDeleteClick(user)}>
                          <FaTrash />
                        </button>
                        <button className="btn-icon role" onClick={() => handleEditUser(user)}>
                          <FaUserShield />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: "2rem" }}>
                    {searchTerm || filterRole || filterStatus
                      ? "Không tìm thấy người dùng phù hợp với bộ lọc"
                      : "Chưa có người dùng nào"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showUserModal && (
        <UserFormModal
          user={currentUser}
          onSave={handleSaveUser}
          onClose={() => setShowUserModal(false)}
          roles={roles}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          title="Xóa người dùng"
          message={`Bạn có chắc chắn muốn xóa người dùng "${currentUser.name}"? Hành động này không thể hoàn tác.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

export default UserManagement
