"use client"

import { memo, useState, useEffect } from "react"
import "./style.scss"
import { FaEye, FaSearch, FaFilter } from "react-icons/fa"
import { formatPrice } from "utils/formatter"

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [filteredOrders, setFilteredOrders] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [ordersPerPage] = useState(10)
  const [selectedOrder, setSelectedOrder] = useState(null)

  useEffect(() => {
    // Mô phỏng dữ liệu đơn hàng
    const mockOrders = [
      {
        id: 1,
        customer: {
          name: "Nguyễn Văn A",
          phone: "0987654321",
          email: "nguyenvana@example.com",
          address: "123 Nguyễn Trãi, Hà Đông, Hà Nội",
        },
        items: [
          { id: 1, title: "Chú thuật hồi chiến - Tập 1", price: 30000, quantity: 1 },
          { id: 2, title: "Naruto - Quyển 20", price: 21000, quantity: 2 },
        ],
        total: 72000,
        shippingFee: 20000,
        discount: 0,
        finalTotal: 92000,
        status: "completed",
        paymentMethod: "cod",
        orderDate: "2023-03-15T08:30:00Z",
        notes: "",
      },
      {
        id: 2,
        customer: {
          name: "Trần Thị B",
          phone: "0912345678",
          email: "tranthib@example.com",
          address: "456 Lê Văn Lương, Quận 7, TP. Hồ Chí Minh",
        },
        items: [
          { id: 3, title: "One Piece - Tập 101", price: 23000, quantity: 1 },
          { id: 4, title: "Dám nghĩ lại", price: 179600, quantity: 1 },
        ],
        total: 202600,
        shippingFee: 20000,
        discount: 0,
        finalTotal: 222600,
        status: "pending",
        paymentMethod: "bank",
        orderDate: "2023-03-15T14:20:00Z",
        notes: "Giao hàng giờ hành chính",
      },
      {
        id: 3,
        customer: {
          name: "Lê Văn C",
          phone: "0978123456",
          email: "levanc@example.com",
          address: "789 Nguyễn Huệ, Hải Châu, Đà Nẵng",
        },
        items: [{ id: 5, title: "Thay đổi cuộc sống với nhân số học", price: 181400, quantity: 1 }],
        total: 181400,
        shippingFee: 20000,
        discount: 0,
        finalTotal: 201400,
        status: "processing",
        paymentMethod: "cod",
        orderDate: "2023-03-16T10:45:00Z",
        notes: "",
      },
      {
        id: 4,
        customer: {
          name: "Phạm Thị D",
          phone: "0965432109",
          email: "phamthid@example.com",
          address: "101 Trần Phú, Ngô Quyền, Hải Phòng",
        },
        items: [
          { id: 6, title: "Thiền định mỗi ngày", price: 118000, quantity: 1 },
          { id: 7, title: "Shin - Cậu bé bút chì - Tập 1", price: 19500, quantity: 1 },
        ],
        total: 137500,
        shippingFee: 20000,
        discount: 0,
        finalTotal: 157500,
        status: "cancelled",
        paymentMethod: "cod",
        orderDate: "2023-03-16T16:30:00Z",
        notes: "Khách hàng hủy đơn",
      },
      {
        id: 5,
        customer: {
          name: "Hoàng Văn E",
          phone: "0932109876",
          email: "hoangvane@example.com",
          address: "202 Lê Lợi, Ninh Kiều, Cần Thơ",
        },
        items: [
          { id: 8, title: "Đội quân Doraemon - Tập 4", price: 19800, quantity: 2 },
          { id: 9, title: "Những ngày tết ta", price: 81000, quantity: 1 },
        ],
        total: 120600,
        shippingFee: 20000,
        discount: 0,
        finalTotal: 140600,
        status: "pending",
        paymentMethod: "bank",
        orderDate: "2023-03-17T09:10:00Z",
        notes: "",
      },
    ]

    setOrders(mockOrders)
    setFilteredOrders(mockOrders)
  }, [])

  useEffect(() => {
    // Lọc đơn hàng dựa trên từ khóa tìm kiếm và trạng thái
    let results = orders

    if (searchTerm) {
      results = results.filter(
        (order) =>
          order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.phone.includes(searchTerm) ||
          order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toString().includes(searchTerm),
      )
    }

    if (selectedStatus !== "all") {
      results = results.filter((order) => order.status === selectedStatus)
    }

    setFilteredOrders(results)
    setCurrentPage(1) // Reset về trang đầu tiên khi lọc
  }, [searchTerm, selectedStatus, orders])

  // Tính toán đơn hàng hiển thị trên trang hiện tại
  const indexOfLastOrder = currentPage * ordersPerPage
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder)

  // Thay đổi trang
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  const handleViewOrder = (order) => {
    setSelectedOrder(order)
  }

  const handleCloseDetail = () => {
    setSelectedOrder(null)
  }

  const handleUpdateStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) => {
      if (order.id === orderId) {
        return { ...order, status: newStatus }
      }
      return order
    })

    setOrders(updatedOrders)

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus })
    }

    alert(`Đã cập nhật trạng thái đơn hàng #${orderId} thành ${getStatusText(newStatus)}`)
  }

  const getStatusClass = (status) => {
    switch (status) {
      case "completed":
        return "status-completed"
      case "pending":
        return "status-pending"
      case "processing":
        return "status-processing"
      case "cancelled":
        return "status-cancelled"
      default:
        return ""
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Hoàn thành"
      case "pending":
        return "Chờ xác nhận"
      case "processing":
        return "Đang xử lý"
      case "cancelled":
        return "Đã hủy"
      default:
        return status
    }
  }

  const getPaymentMethodText = (method) => {
    switch (method) {
      case "cod":
        return "Thanh toán khi nhận hàng"
      case "bank":
        return "Chuyển khoản ngân hàng"
      default:
        return method
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="admin-orders">
      <div className="admin-content">
        <div className="admin-header">
          <h1>Quản lý đơn hàng</h1>
        </div>

        <div className="filter-section">
          <div className="search-box">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, số điện thoại, email hoặc mã đơn hàng..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="status-filter">
            <FaFilter className="filter-icon" />
            <select value={selectedStatus} onChange={(e) => setSelectedStatus(e.target.value)}>
              <option value="all">Tất cả trạng thái</option>
              <option value="pending">Chờ xác nhận</option>
              <option value="processing">Đang xử lý</option>
              <option value="completed">Hoàn thành</option>
              <option value="cancelled">Đã hủy</option>
            </select>
          </div>
        </div>

        <div className="orders-table-container">
          <table className="orders-table">
            <thead>
              <tr>
                <th>Mã đơn</th>
                <th>Khách hàng</th>
                <th>Ngày đặt</th>
                <th>Tổng tiền</th>
                <th>Phương thức</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {currentOrders.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">
                    Không tìm thấy đơn hàng nào
                  </td>
                </tr>
              ) : (
                currentOrders.map((order) => (
                  <tr key={order.id}>
                    <td>#{order.id}</td>
                    <td>
                      <div className="customer-info">
                        <div className="customer-name">{order.customer.name}</div>
                        <div className="customer-phone">{order.customer.phone}</div>
                      </div>
                    </td>
                    <td>{formatDate(order.orderDate)}</td>
                    <td>{formatPrice(order.finalTotal)}</td>
                    <td>{order.paymentMethod === "cod" ? "COD" : "Chuyển khoản"}</td>
                    <td>
                      <span className={`status-badge ${getStatusClass(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                    </td>
                    <td className="action-buttons">
                      <button className="view-button" onClick={() => handleViewOrder(order)} title="Xem chi tiết">
                        <FaEye />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Phân trang */}
        {filteredOrders.length > ordersPerPage && (
          <div className="pagination">
            {Array.from({ length: Math.ceil(filteredOrders.length / ordersPerPage) }, (_, i) => (
              <button
                key={i}
                className={`page-button ${currentPage === i + 1 ? "active" : ""}`}
                onClick={() => paginate(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}

        {/* Modal chi tiết đơn hàng */}
        {selectedOrder && (
          <div className="order-detail-modal">
            <div className="modal-content">
              <div className="modal-header">
                <h2>Chi tiết đơn hàng #{selectedOrder.id}</h2>
                <button className="close-button" onClick={handleCloseDetail}>
                  ×
                </button>
              </div>

              <div className="order-detail">
                <div className="detail-section">
                  <h3>Thông tin khách hàng</h3>
                  <div className="customer-details">
                    <p>
                      <strong>Họ tên:</strong> {selectedOrder.customer.name}
                    </p>
                    <p>
                      <strong>Số điện thoại:</strong> {selectedOrder.customer.phone}
                    </p>
                    <p>
                      <strong>Email:</strong> {selectedOrder.customer.email}
                    </p>
                    <p>
                      <strong>Địa chỉ:</strong> {selectedOrder.customer.address}
                    </p>
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Thông tin đơn hàng</h3>
                  <div className="order-info">
                    <p>
                      <strong>Ngày đặt hàng:</strong> {formatDate(selectedOrder.orderDate)}
                    </p>
                    <p>
                      <strong>Phương thức thanh toán:</strong> {getPaymentMethodText(selectedOrder.paymentMethod)}
                    </p>
                    <p>
                      <strong>Trạng thái:</strong>{" "}
                      <span className={`status-badge ${getStatusClass(selectedOrder.status)}`}>
                        {getStatusText(selectedOrder.status)}
                      </span>
                    </p>
                    {selectedOrder.notes && (
                      <p>
                        <strong>Ghi chú:</strong> {selectedOrder.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="detail-section">
                  <h3>Sản phẩm</h3>
                  <table className="order-items-table">
                    <thead>
                      <tr>
                        <th>Sản phẩm</th>
                        <th>Giá</th>
                        <th>Số lượng</th>
                        <th>Thành tiền</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                          <td>{item.title}</td>
                          <td>{formatPrice(item.price)}</td>
                          <td>{item.quantity}</td>
                          <td>{formatPrice(item.price * item.quantity)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="detail-section">
                  <h3>Tổng cộng</h3>
                  <div className="order-summary">
                    <div className="summary-row">
                      <span>Tạm tính:</span>
                      <span>{formatPrice(selectedOrder.total)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Phí vận chuyển:</span>
                      <span>{formatPrice(selectedOrder.shippingFee)}</span>
                    </div>
                    {selectedOrder.discount > 0 && (
                      <div className="summary-row">
                        <span>Giảm giá:</span>
                        <span>-{formatPrice(selectedOrder.discount)}</span>
                      </div>
                    )}
                    <div className="summary-row total">
                      <span>Thành tiền:</span>
                      <span>{formatPrice(selectedOrder.finalTotal)}</span>
                    </div>
                  </div>
                </div>

                {selectedOrder.status !== "completed" && selectedOrder.status !== "cancelled" && (
                  <div className="detail-section">
                    <h3>Cập nhật trạng thái</h3>
                    <div className="status-actions">
                      {selectedOrder.status === "pending" && (
                        <button
                          className="status-button processing"
                          onClick={() => handleUpdateStatus(selectedOrder.id, "processing")}
                        >
                          Xác nhận đơn hàng
                        </button>
                      )}
                      {selectedOrder.status === "processing" && (
                        <button
                          className="status-button completed"
                          onClick={() => handleUpdateStatus(selectedOrder.id, "completed")}
                        >
                          Hoàn thành đơn hàng
                        </button>
                      )}
                      <button
                        className="status-button cancelled"
                        onClick={() => handleUpdateStatus(selectedOrder.id, "cancelled")}
                      >
                        Hủy đơn hàng
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default memo(Orders)

