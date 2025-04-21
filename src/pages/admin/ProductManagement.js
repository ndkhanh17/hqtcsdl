"use client"

import { useState } from "react"
import { FaPlus, FaEdit, FaTrash, FaSearch, FaFilter } from "react-icons/fa"
import ProductFormModal from "../../components/products/ProductFormModal"
import DeleteConfirmModal from "../../components/common/DeleteConfirmModal"
import "../../styles/pages/productManagement.scss"

// Sample product data
const initialProducts = [
  { id: 1, name: "Áo thun nam cổ tròn", category: "Thời trang nam", price: 299000, stock: 150, status: "Còn hàng" },
  { id: 2, name: "Đầm nữ mùa hè", category: "Thời trang nữ", price: 499000, stock: 85, status: "Còn hàng" },
  { id: 3, name: "Áo hoodie unisex", category: "Unisex", price: 399000, stock: 120, status: "Còn hàng" },
  { id: 4, name: "Quần jean nữ", category: "Thời trang nữ", price: 599000, stock: 75, status: "Còn hàng" },
  { id: 5, name: "Áo sơ mi nam", category: "Thời trang nam", price: 459000, stock: 60, status: "Còn hàng" },
  { id: 6, name: "Áo kiểu nữ", category: "Thời trang nữ", price: 349000, stock: 90, status: "Còn hàng" },
  { id: 7, name: "Quần jean nam", category: "Thời trang nam", price: 549000, stock: 8, status: "Sắp hết" },
  { id: 8, name: "Áo len nữ", category: "Thời trang nữ", price: 449000, stock: 0, status: "Hết hàng" },
  { id: 9, name: "Áo khoác denim", category: "Unisex", price: 699000, stock: 45, status: "Còn hàng" },
  { id: 10, name: "Váy dài nữ", category: "Thời trang nữ", price: 799000, stock: 30, status: "Còn hàng" },
  { id: 11, name: "Áo polo nam", category: "Thời trang nam", price: 359000, stock: 55, status: "Còn hàng" },
  { id: 12, name: "Quần short nam", category: "Thời trang nam", price: 299000, stock: 5, status: "Sắp hết" },
]

const ProductManagement = () => {
  const [products, setProducts] = useState(initialProducts)
  const [searchTerm, setSearchTerm] = useState("")
  const [showProductModal, setShowProductModal] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [currentProduct, setCurrentProduct] = useState(null)
  const [filterCategory, setFilterCategory] = useState("")

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

  const handleDeleteConfirm = () => {
    setProducts(products.filter((p) => p.id !== currentProduct.id))
    setShowDeleteModal(false)
  }

  const handleSaveProduct = (product) => {
    if (product.id) {
      // Edit existing product
      setProducts(products.map((p) => (p.id === product.id ? product : p)))
    } else {
      // Add new product
      const newProduct = {
        ...product,
        id: Math.max(...products.map((p) => p.id)) + 1,
        status: product.stock > 0 ? (product.stock < 10 ? "Sắp hết" : "Còn hàng") : "Hết hàng",
      }
      setProducts([...products, newProduct])
    }
    setShowProductModal(false)
  }

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filterCategory === "" || product.category === filterCategory)
    )
  })

  const categories = [...new Set(products.map((p) => p.category))]

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
            {filteredProducts.map((product) => (
              <tr key={product.id}>
                <td>#{product.id}</td>
                <td>
                  <div className="product-image">
                    <img src="/placeholder.svg?height=40&width=40" alt={product.name} />
                  </div>
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>{product.price.toLocaleString()}đ</td>
                <td>{product.stock}</td>
                <td>
                  <span
                    className={`status-badge ${product.status === "Còn hàng" ? "active" : product.status === "Sắp hết" ? "low-stock" : "out-of-stock"}`}
                  >
                    {product.status}
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
            ))}
          </tbody>
        </table>
      </div>

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
