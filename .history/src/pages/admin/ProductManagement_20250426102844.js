"use client"

import { useEffect, useState } from "react"
import { FaEdit, FaFilter, FaPlus, FaSearch, FaSpinner, FaTrash } from "react-icons/fa"
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal"
import ProductFormModal from "../../components/products/ProductFormModal"
import "../../styles/pages/productManagement.scss"

const API_BASE_URL = "https://hqtcsdl-git-main-bui-duc-hungs-projects.vercel.app/admin"

const ProductManagement = () => {
  const [products, setProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [showProductModal, setShowProductModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [filterCategory, setFilterCategory] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [categories, setCategories] = useState([])

  // Fetch products from API
  const fetchProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`${API_BASE_URL}/products`)
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }
      const data = await response.json()
      setProducts(data)

      // Extract unique categories
      const uniqueCategories = [...new Set(data.map((product) => product.category))]
      setCategories(uniqueCategories)
    } catch (err) {
      console.error("Error fetching products:", err)
      setError("Không thể tải danh sách sản phẩm. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleAddProduct = () => {
    setCurrentProduct(null)
    setShowProductModal(true)
  }

  const handleEditProduct = (product) => {
    setCurrentProduct(product)
    setShowProductModal(true)
  }

  const handleDeleteClick = (product) => {
    setCurrentProduct(product)
    setShowDeleteModal(true)
  }

  const handleDeleteConfirm = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/products/delete/${currentProduct.id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Refresh product list after successful deletion
      fetchProducts()
      setShowDeleteModal(false)
    } catch (err) {
      console.error("Error deleting product:", err)
      setError("Không thể xóa sản phẩm. Vui lòng thử lại sau.")
      setLoading(false)
    }
  }

  const handleSaveProduct = async (product) => {
    setLoading(true)
    try {
      let response

      if (product.id) {
        // Update existing product
        response = await fetch(`${API_BASE_URL}/products/update/${product.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        })
      } else {
        // Add new product
        response = await fetch(`${API_BASE_URL}/products/create`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(product),
        })
      }

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`)
      }

      // Refresh product list after successful save
      fetchProducts()
      setShowProductModal(false)
    } catch (err) {
      console.error("Error saving product:", err)
      setError(`Không thể ${product.id ? "cập nhật" : "thêm"} sản phẩm. Vui lòng thử lại sau.`)
      setLoading(false)
    }
  }

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === "" || product.category === filterCategory)
    )
  })

  return (
    <div className="product-management-page">
      <div className="page-header">
        <h1>Quản lý sản phẩm</h1>
        <button className="btn-primary" onClick={handleAddProduct}>
          <FaPlus /> Thêm sản phẩm mới
        </button>
      </div>

      <div className="filters-bar">
        <div className="search-box">
          <FaSearch />
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-box">
          <FaFilter />
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
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

      {loading && !showProductModal && !showDeleteModal ? (
        <div
          className="loading-container"
          style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "3rem" }}
        >
          <FaSpinner
            className="spinner"
            style={{ fontSize: "2rem", color: "var(--primary-color)", animation: "spin 1s linear infinite" }}
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
          <table className="products-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Hình ảnh</th>
                <th>Tên sản phẩm</th>
                <th>Danh mục</th>
                <th>Giá</th>
                <th>Tồn kho</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => (
                  <tr key={product.id}>
                    <td>#{product.id}</td>
                    <td>
                      <div className="product-image">
                        <img src={product.image || "/placeholder.svg?height=40&width=40"} alt={product.name} />
                      </div>
                    </td>
                    <td>{product.name}</td>
                    <td>{product.category}</td>
                    <td>{product.price?.toLocaleString()}đ</td>
                    <td>{product.stock}</td>
                    <td>
                      <span
                        className={`status-badge ${
                          product.stock > 10 ? "active" : product.stock > 0 ? "low-stock" : "out-of-stock"
                        }`}
                      >
                        {product.stock > 10 ? "Còn hàng" : product.stock > 0 ? "Sắp hết" : "Hết hàng"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon edit" onClick={() => handleEditProduct(product)}>
                          <FaEdit />
                        </button>
                        <button className="btn-icon delete" onClick={() => handleDeleteClick(product)}>
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" style={{ textAlign: "center", padding: "2rem" }}>
                    {searchTerm || filterCategory
                      ? "Không tìm thấy sản phẩm phù hợp với bộ lọc"
                      : "Chưa có sản phẩm nào"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showProductModal && (
        <ProductFormModal
          product={currentProduct}
          onSave={handleSaveProduct}
          onClose={() => setShowProductModal(false)}
          categories={categories}
        />
      )}

      {showDeleteModal && (
        <DeleteConfirmModal
          title="Xóa sản phẩm"
          message={`Bạn có chắc chắn muốn xóa sản phẩm "${currentProduct.name}"? Hành động này không thể hoàn tác.`}
          onConfirm={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </div>
  )
}

export default ProductManagement
