"use client"

import { useEffect, useState } from "react"
import { FaEdit, FaPlus, FaSearch, FaSpinner, FaTimes, FaTrash } from "react-icons/fa"
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal"
import "../../styles/pages/categoryManagement.scss"

const API_BASE_URL = "https://hqtcsdl-git-main-bui-duc-hungs-projects.vercel.app/admin"

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentCategory, setCurrentCategory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [editMode, setEditMode] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch categories from API
  const fetchCategories = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/categories`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const result = await response.json()

      // Xử lý các cấu trúc dữ liệu khác nhau có thể có
      let categoriesData = []
      if (result.data && Array.isArray(result.data.categories)) {
        // Nếu API trả về cấu trúc { data: { categories: [...] } }
        categoriesData = result.data.categories
      } else if (Array.isArray(result.data)) {
        // Nếu API trả về cấu trúc { data: [...] }
        categoriesData = result.data
      } else if (Array.isArray(result)) {
        // Nếu API trả về trực tiếp mảng danh mục
        categoriesData = result
      }

      setCategories(categoriesData)
    } catch (err) {
      console.error("Error fetching categories:", err)
      setError("Không thể tải danh sách danh mục. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const handleAddCategory = () => {
    setCurrentCategory(null)
    setNewCategoryName("")
    setEditMode(false)
    setShowCategoryModal(true)
  }

  const handleEditCategory = (category) => {
    setCurrentCategory(category)
    setNewCategoryName(category.name || "")
    setEditMode(true)
    setShowCategoryModal(true)
  }

  const handleDeleteClick = (category) => {
    setCurrentCategory(category)
    setShowDeleteModal(true)
  }

  // Cập nhật lại URL API cho việc xóa danh mục
  const handleDeleteConfirm = async () => {
    setIsSubmitting(true)
    try {
      const categoryId = currentCategory._id || currentCategory.id
      // Sửa lại URL theo định dạng API đã cung cấp
      const response = await fetch(`${API_BASE_URL}/categories/delete:${categoryId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Refresh category list after successful deletion
      await fetchCategories()
      setShowDeleteModal(false)
    } catch (err) {
      console.error("Error deleting category:", err)
      setError("Không thể xóa danh mục. Vui lòng thử lại sau.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Cập nhật lại URL API cho việc cập nhật danh mục
  const handleSaveCategory = async () => {
    if (!newCategoryName.trim()) {
      setError("Tên danh mục không được để trống")
      return
    }

    setIsSubmitting(true)
    try {
      let response

      if (editMode) {
        // Update existing category
        const categoryId = currentCategory._id || currentCategory.id
        // Sửa lại URL theo định dạng API đã cung cấp
        response = await fetch(`${API_BASE_URL}/categories/update:${categoryId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newCategoryName }),
        })
      } else {
        // Add new category
        response = await fetch(`${API_BASE_URL}/categories/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newCategoryName }),
        })
      }

      // Log response để debug
      console.log("API Response status:", response.status)
      const responseData = await response.json().catch(() => ({}))
      console.log("API Response data:", responseData)

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}, Message: ${responseData.message || "Unknown error"}`)
      }

      // Refresh category list after successful save
      await fetchCategories()
      setShowCategoryModal(false)
      setError(null)
    } catch (err) {
      console.error("Error saving category:", err)
      setError(`Không thể ${editMode ? "cập nhật" : "thêm"} danh mục. Chi tiết lỗi: ${err.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredCategories = Array.isArray(categories)
    ? categories.filter((category) => {
        return category.name?.toLowerCase().includes(searchTerm.toLowerCase())
      })
    : []

  return (
    <div className="category-management-page">
      <div className="page-header">
        <h1>Quản lý danh mục</h1>
        <button className="btn-primary" onClick={handleAddCategory}>
          <FaPlus /> Thêm danh mục mới
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm danh mục..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading && !showCategoryModal && !showDeleteModal ? (
        <div className="loading-container">
          <FaSpinner className="spinner" />
        </div>
      ) : (
        <div className="table-responsive">
          <table className="categories-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên danh mục</th>
                <th>Số sản phẩm</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category._id || category.id}>
                    <td>#{category._id || category.id || "N/A"}</td>
                    <td>{category.name || "Chưa đặt tên"}</td>
                    <td>{category.productCount || 0}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon edit" onClick={() => handleEditCategory(category)}>
                          <FaEdit />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDeleteClick(category)}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: "center", padding: "2rem" }}>
                    {searchTerm ? "Không tìm thấy danh mục phù hợp" : "Chưa có danh mục nào"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showCategoryModal && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{editMode ? "Chỉnh sửa danh mục" : "Thêm danh mục mới"}</h2>
              <button className="close-btn" onClick={() => setShowCategoryModal(false)} disabled={isSubmitting}>
                <FaTimes />
              </button>
            </div>
            <div className="modal-content" style={{ padding: "1.25rem" }}>
              <div className="form-group">
                <label htmlFor="categoryName">Tên danh mục</label>
                <input
                  type="text"
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  disabled={isSubmitting}
                  required
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setShowCategoryModal(false)}
                disabled={isSubmitting}
              >
                Hủy
              </button>
              <button type="button" className="btn-primary" onClick={handleSaveCategory} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <FaSpinner className="spinner" style={{ marginRight: "0.5rem" }} />
                    Đang xử lý...
                  </>
                ) : editMode ? (
                  "Cập nhật danh mục"
                ) : (
                  "Thêm danh mục"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          title="Xóa danh mục"
          message={`Bạn có chắc chắn muốn xóa danh mục "${currentCategory.name || "Không tên"}"? Hành động này không thể hoàn tác.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

export default CategoryManagement
