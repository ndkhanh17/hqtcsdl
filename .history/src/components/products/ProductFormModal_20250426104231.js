"use client"

import { useEffect, useState } from "react"
import { FaPlus, FaSpinner, FaTimes, FaUpload } from "react-icons/fa"
import "../../styles/components/modal.scss"
import "../../styles/components/productForm.scss"

const ProductFormModal = ({ product, onSave, onClose, categories, onAddCategory }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    image: null,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newCategory, setNewCategory] = useState("")
  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false)
  const [addingCategory, setAddingCategory] = useState(false)
  const [categoryError, setCategoryError] = useState("")

  useEffect(() => {
    if (product) {
      setFormData({
        id: product.id,
        name: product.name || "",
        category: product.category || "",
        price: product.price || "",
        stock: product.stock || "",
        description: product.description || "",
        image: product.image || null,
      })
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "category" && value === "new") {
      setShowNewCategoryInput(true)
      return
    }

    setFormData({
      ...formData,
      [name]: name === "price" || name === "stock" ? Number.parseFloat(value) || "" : value,
    })
  }

  const handleNewCategoryChange = (e) => {
    setNewCategory(e.target.value)
    setCategoryError("")
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) {
      setCategoryError("Tên danh mục không được để trống")
      return
    }

    setAddingCategory(true)
    try {
      const success = await onAddCategory(newCategory.trim())
      if (success) {
        setFormData({
          ...formData,
          category: newCategory.trim(),
        })
        setShowNewCategoryInput(false)
        setNewCategory("")
      } else {
        setCategoryError("Không thể thêm danh mục. Vui lòng thử lại.")
      }
    } catch (error) {
      setCategoryError("Đã xảy ra lỗi khi thêm danh mục.")
    } finally {
      setAddingCategory(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSave(formData)
    } catch (error) {
      console.error("Error saving product:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{product ? "Chỉnh sửa sản phẩm" : "Thêm sản phẩm mới"}</h2>
          <button className="close-btn" onClick={onClose} disabled={isSubmitting}>
            <FaTimes />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="name">Tên sản phẩm</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="category">Danh mục</label>
              {!showNewCategoryInput ? (
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  required
                  disabled={isSubmitting}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                  <option value="new">+ Thêm danh mục mới</option>
                </select>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <input
                      type="text"
                      value={newCategory}
                      onChange={handleNewCategoryChange}
                      placeholder="Nhập tên danh mục mới"
                      disabled={isSubmitting || addingCategory}
                      className={categoryError ? "error" : ""}
                    />
                    <button
                      type="button"
                      onClick={handleAddCategory}
                      className="btn-primary"
                      style={{ padding: "0.5rem" }}
                      disabled={isSubmitting || addingCategory || !newCategory.trim()}
                    >
                      {addingCategory ? <FaSpinner className="spinner" /> : <FaPlus />}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowNewCategoryInput(false)
                        setNewCategory("")
                        setCategoryError("")
                      }}
                      className="btn-secondary"
                      style={{ padding: "0.5rem" }}
                      disabled={isSubmitting || addingCategory}
                    >
                      <FaTimes />
                    </button>
                  </div>
                  {categoryError && <div className="error-message">{categoryError}</div>}
                </div>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="price">Giá (đ)</label>
              <input
                type="number"
                id="price"
                name="price"
                min="0"
                step="1000"
                value={formData.price}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>

            <div className="form-group">
              <label htmlFor="stock">Tồn kho</label>
              <input
                type="number"
                id="stock"
                name="stock"
                min="0"
                value={formData.stock}
                onChange={handleChange}
                required
                disabled={isSubmitting}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="description">Mô tả</label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              disabled={isSubmitting}
            ></textarea>
          </div>

          <div className="form-group">
            <label>Hình ảnh sản phẩm</label>
            <div className="image-upload">
              <div className="image-preview">
                {formData.image ? (
                  <img src={formData.image || "/placeholder.svg"} alt="Xem trước sản phẩm" />
                ) : (
                  <img src="/placeholder.svg?height=100&width=100" alt="Không có hình ảnh" />
                )}
              </div>
              <div className="upload-controls">
                <button type="button" className="btn-upload" disabled={isSubmitting}>
                  <FaUpload /> Tải lên hình ảnh
                </button>
                <p className="upload-hint">Định dạng hỗ trợ: JPG, PNG. Kích thước tối đa: 2MB</p>
                <input
                  type="text"
                  name="image"
                  placeholder="Hoặc nhập URL hình ảnh"
                  value={formData.image || ""}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  style={{ marginTop: "0.5rem" }}
                />
              </div>
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose} disabled={isSubmitting}>
              Hủy
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <FaSpinner className="spinner" style={{ marginRight: "0.5rem" }} />
                  Đang xử lý...
                </>
              ) : product ? (
                "Cập nhật sản phẩm"
              ) : (
                "Thêm sản phẩm"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductFormModal
