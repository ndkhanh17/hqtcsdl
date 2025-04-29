"use client"

import { useState } from "react"
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal"
import RoleFormModal from "../../components/roles/RoleFormModal"
import "../../styles/pages/roleManagement.scss"

// Sample role data
const initialRoles = [ /* dữ liệu vai trò như cũ */ ]

const RoleManagement = () => {
  const [roles, setRoles] = useState(initialRoles)
  const [searchTerm, setSearchTerm] = useState("")
  const [showRoleModal, setShowRoleModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentRole, setCurrentRole] = useState(null)

  const handleAddRole = () => {
    setCurrentRole(null)
    setShowRoleModal(true)
  }

  const handleEditRole = (role) => {
    setCurrentRole(role)
    setShowRoleModal(true)
  }

  const handleDeleteClick = (role) => {
    setCurrentRole(role)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    try {
      const response = await fetch(`https://hqtcsdl-git-main-bui-duc-hungs-projects.vercel.app/admin/accounts/delete${currentRole.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Xóa vai trò thất bại")
      }

      setRoles(roles.filter((r) => r.id !== currentRole.id))
      setShowDeleteModal(false)
    } catch (error) {
      console.error(error)
    }
  }

  const handleSaveRole = async (role) => {
    if (role.id) {
      // Edit existing role
      try {
        const response = await fetch(`https://hqtcsdl-git-main-bui-duc-hungs-projects.vercel.app/admin/accounts/update/${role.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(role),
        })

        if (!response.ok) {
          throw new Error("Cập nhật vai trò thất bại")
        }

        setRoles(roles.map((r) => (r.id === role.id ? role : r)))
        setShowRoleModal(false)
      } catch (error) {
        console.error(error)
      }
    } else {
      // Add new role
      try {
        const response = await fetch("https://hqtcsdl-git-main-bui-duc-hungs-projects.vercel.app/admin/accounts/create", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(role),
        })

        if (!response.ok) {
          throw new Error("Thêm vai trò thất bại")
        }

        const newRole = {
          ...role,
          id: Math.max(...roles.map((r) => r.id)) + 1, // Hoặc lấy ID từ response
          userCount: 0,
        }

        setRoles([...roles, newRole])
        setShowRoleModal(false)
      } catch (error) {
        console.error(error)
      }
    }
  }

  const filteredRoles = roles.filter((role) => {
    return (
      role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })

  return (
    <div className="role-management-page">
      {/* Các phần giao diện như cũ */}

      {showRoleModal && (
        <RoleFormModal
          role={currentRole}
          onSave={handleSaveRole}
          onClose={() => setShowRoleModal(false)}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          title="Xóa vai trò"
          message={`Bạn có chắc chắn muốn xóa vai trò "${currentRole.name}"? Hành động này không thể hoàn tác.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

export default RoleManagement
