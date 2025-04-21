"use client"

import { useState } from "react"
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter, FaUserShield } from "react-icons/fa"
import UserFormModal from "../../components/users/UserFormModal"
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal"
import "../../styles/pages/userManagement.scss"

// Sample user data
const initialUsers = [
  {
    id: 1,
    name: "Nguyễn Văn An",
    email: "nguyenvanan@example.com",
    role: "Khách hàng",
    status: "Hoạt động",
    lastLogin: "15/05/2023",
  },
  {
    id: 2,
    name: "Trần Thị Bình",
    email: "tranthib@example.com",
    role: "Khách hàng",
    status: "Hoạt động",
    lastLogin: "14/05/2023",
  },
  {
    id: 3,
    name: "Quản Trị Viên",
    email: "admin@example.com",
    role: "Quản trị viên",
    status: "Hoạt động",
    lastLogin: "15/05/2023",
  },
  {
    id: 4,
    name: "Lê Văn Cường",
    email: "levanc@example.com",
    role: "Khách hàng",
    status: "Không hoạt động",
    lastLogin: "30/04/2023",
  },
  {
    id: 5,
    name: "Phạm Thị Dung",
    email: "phamthid@example.com",
    role: "Quản lý",
    status: "Hoạt động",
    lastLogin: "13/05/2023",
  },
  {
    id: 6,
    name: "Hoàng Văn Em",
    email: "hoangvane@example.com",
    role: "Khách hàng",
    status: "Bị chặn",
    lastLogin: "20/03/2023",
  },
  {
    id: 7,
    name: "Ngô Thị Phương",
    email: "ngothip@example.com",
    role: "Khách hàng",
    status: "Hoạt động",
    lastLogin: "12/05/2023",
  },
  {
    id: 8,
    name: "Đỗ Văn Giang",
    email: "dovang@example.com",
    role: "Khách hàng",
    status: "Hoạt động",
    lastLogin: "10/05/2023",
  },
  {
    id: 9,
    name: "Vũ Thị Hương",
    email: "vuthih@example.com",
    role: "Khách hàng",
    status: "Hoạt động",
    lastLogin: "09/05/2023",
  },
  {
    id: 10,
    name: "Lý Văn Khoa",
    email: "lyvank@example.com",
    role: "Khách hàng",
    status: "Không hoạt động",
    lastLogin: "01/05/2023",
  },
]

const UserManagement = () => {
  const [users, setUsers] = useState(initialUsers)
  const [searchTerm, setSearchTerm] = useState("")
  const [showUserModal, setShowUserModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)
  const [filterRole, setFilterRole] = useState("")
  const [filterStatus, setFilterStatus] = useState("")

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

  const handleDeleteConfirm = () => {
    setUsers(users.filter((u) => u.id !== currentUser.id))
    setShowDeleteModal(false)
  }

  const handleSaveUser = (user) => {
    if (user.id) {
      // Edit existing user
      setUsers(users.map((u) => (u.id === user.id ? user : u)))
    } else {
      // Add new user
      const newUser = {
        ...user,
        id: Math.max(...users.map((u) => u.id)) + 1,
        lastLogin: "Chưa đăng nhập",
      }
      setUsers([...users, newUser])
    }
    setShowUserModal(false)
  }

  const filteredUsers = users.filter((user) => {
    return (
      (user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (filterRole === "" || user.role === filterRole) &&
      (filterStatus === "" || user.status === filterStatus)
    )
  })

  const roles = [...new Set(users.map((u) => u.role))]
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
            {filteredUsers.map((user) => (
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
            ))}
          </tbody>
        </table>
      </div>

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
