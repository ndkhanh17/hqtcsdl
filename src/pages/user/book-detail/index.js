"use client"

import { memo, useEffect, useState } from "react"
import "./style.scss"
import { useParams, Link } from "react-router-dom"
import { FaHeart, FaShoppingCart, FaTrash } from "react-icons/fa"
import { formatPrice } from "utils/formatter"

const BookDetail = () => {
  const { id } = useParams()
  const [book, setBook] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [relatedBooks, setRelatedBooks] = useState([])
  const [viewedBooks, setViewedBooks] = useState([])
  const [seriesBooks, setSeriesBooks] = useState([])
  const [isInCart, setIsInCart] = useState(false)

  useEffect(() => {
    window.scrollTo(0, 0)

    // Mô phỏng dữ liệu chi tiết sách
    const mockBook = {
      id: Number.parseInt(id),
      title: "Chú thuật hồi chiến - Tập 1 - Bản thường",
      price: 27000,
      originalPrice: 30000,
      image: "/placeholder.svg?height=400&width=300",
      code: "2651656",
      author: "Gege Akutami",
      dimensions: "11.3 x 17.6 cm",
      pages: 192,
      format: "Bìa mềm",
      weight: "140 gram",
      series: "Chú thuật hồi chiến",
      description:
        "Itadori Yuji là một học sinh cấp Ba sở hữu năng lực thể chất phi thường. Hàng ngày cậu thường tới bệnh viện chăm sóc ông nội đang ốm liệt giường. Nhưng một ngày nọ, phong ấn của &quot;vật thể bị nguyền&quot; mà trường cậu đang bảo quản bị phá vỡ, quái vật xuất hiện. Để cứu hai anh chị khóa trên đang gặp nguy hiểm, Itadori đã nuốt &quot;vật thể bị nguyền&quot; và trở thành chủ nhân của Sukuna, &quot;Vua của các nguyền&quot;! Số phận của Itadori từ đây sẽ ra sao!?",
      ratings: 4.5,
      reviewCount: 15,
      soldCount: 2415,
    }

    // Mô phỏng dữ liệu sách liên quan
    const mockRelatedBooks = [
      {
        id: 101,
        title: "Blerock - Tập 21",
        price: 31500,
        image: "/placeholder.svg?height=300&width=200",
        category: "Manga",
      },
      {
        id: 102,
        title: "World Trigger - Tập 2",
        price: 31500,
        image: "/placeholder.svg?height=300&width=200",
        category: "Manga",
      },
      {
        id: 103,
        title: "KOMI - NỮ THẦN SỢ GIAO TIẾP - Tập 25",
        price: 22500,
        image: "/placeholder.svg?height=300&width=200",
        category: "Manga",
      },
      {
        id: 104,
        title: "Dragon Ball - Tập 23",
        price: 22500,
        image: "/placeholder.svg?height=300&width=200",
        category: "Manga",
      },
    ]

    // Mô phỏng dữ liệu sách đã xem
    const mockViewedBooks = [
      {
        id: 8,
        title: "Chú thuật hồi chiến - Tập 1",
        price: 30000,
        image: "/placeholder.svg?height=300&width=200",
        category: "Manga",
      },
      {
        id: 12,
        title: "Đội quân Doraemon - Tập 4",
        price: 19800,
        image: "/placeholder.svg?height=300&width=200",
        category: "Manga",
      },
      {
        id: 15,
        title: "Thay đổi cuộc sống với nhân số học",
        price: 181400,
        image: "/placeholder.svg?height=300&width=200",
        category: "Kỹ năng sống",
      },
      {
        id: 9,
        title: "Xe buýt dừa em đi",
        price: 36000,
        image: "/placeholder.svg?height=300&width=200",
        category: "Manga",
      },
    ]

    // Mô phỏng dữ liệu sách cùng bộ
    const mockSeriesBooks = [
      {
        id: 201,
        title: "Chú thuật hồi chiến - Tập 20",
        price: 58500,
        image: "/placeholder.svg?height=300&width=200",
        category: "Manga",
      },
      {
        id: 202,
        title: "Chú thuật hồi chiến - Tập 19",
        price: 70500,
        image: "/placeholder.svg?height=300&width=200",
        category: "Manga",
      },
      {
        id: 203,
        title: "Chú thuật hồi chiến - Tập 16",
        price: 58500,
        image: "/placeholder.svg?height=300&width=200",
        category: "Manga",
      },
      {
        id: 204,
        title: "Chú thuật hồi chiến - Tập 13",
        price: 27000,
        image: "/placeholder.svg?height=300&width=200",
        category: "Manga",
      },
    ]

    // Kiểm tra xem sách đã có trong giỏ hàng chưa
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const bookInCart = cart.find((item) => item.id === Number.parseInt(id))

    setBook(mockBook)
    setRelatedBooks(mockRelatedBooks)
    setViewedBooks(mockViewedBooks)
    setSeriesBooks(mockSeriesBooks)
    setIsInCart(!!bookInCart)

    // Lưu sách vào danh sách đã xem
    const viewedList = JSON.parse(localStorage.getItem("viewedBooks") || "[]")
    if (!viewedList.some((item) => item.id === Number.parseInt(id))) {
      const newViewedList = [
        {
          id: Number.parseInt(id),
          title: mockBook.title,
          price: mockBook.price,
          image: mockBook.image,
          category: "Manga",
        },
        ...viewedList.slice(0, 9),
      ]
      localStorage.setItem("viewedBooks", JSON.stringify(newViewedList))
    }
  }, [id])

  const handleQuantityChange = (value) => {
    const newQuantity = quantity + value
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
    }
  }

  const addToCart = () => {
    if (!book) return

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const existingItemIndex = cart.findIndex((item) => item.id === book.id)

    if (existingItemIndex >= 0) {
      cart[existingItemIndex].quantity += quantity
    } else {
      cart.push({
        id: book.id,
        title: book.title,
        price: book.price,
        image: book.image,
        quantity: quantity,
      })
    }

    localStorage.setItem("cart", JSON.stringify(cart))
    setIsInCart(true)
    alert("Đã thêm sách vào giỏ hàng!")
  }

  const removeFromCart = () => {
    if (!book) return

    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const updatedCart = cart.filter((item) => item.id !== book.id)

    localStorage.setItem("cart", JSON.stringify(updatedCart))
    setIsInCart(false)
    alert("Đã xóa sách khỏi giỏ hàng!")
  }

  if (!book) {
    return <div className="loading">Đang tải...</div>
  }

  return (
    <div className="book-detail-page">
      <div className="container">
        <div className="book-detail-container">
          <div className="book-image-container">
            <img src={book.image || "/placeholder.svg"} alt={book.title} className="book-image" />
          </div>

          <div className="book-info-container">
            <h1 className="book-title">{book.title}</h1>

            <div className="book-ratings">
              {[...Array(5)].map((_, i) => (
                <span key={i} className={`star ${i < Math.floor(book.ratings) ? "filled" : ""}`}>
                  ★
                </span>
              ))}
              <span className="rating-count">
                {book.ratings} ({book.reviewCount} đánh giá)
              </span>
              <span className="sold-count">Đã bán: {book.soldCount}</span>
            </div>

            <div className="book-price">
              <span className="current-price">{formatPrice(book.price)}</span>
              {book.originalPrice > book.price && (
                <span className="original-price">
                  (Bạn đã tiết kiệm được: {formatPrice(book.originalPrice - book.price)})
                </span>
              )}
            </div>

            <div className="book-details">
              <div className="detail-item">
                <span className="label">Mã sách:</span>
                <span className="value">{book.code}</span>
              </div>
              <div className="detail-item">
                <span className="label">Tác giả:</span>
                <span className="value">{book.author}</span>
              </div>
              <div className="detail-item">
                <span className="label">Kích thước:</span>
                <span className="value">{book.dimensions}</span>
              </div>
              <div className="detail-item">
                <span className="label">Số trang:</span>
                <span className="value">{book.pages}</span>
              </div>
              <div className="detail-item">
                <span className="label">Định dạng:</span>
                <span className="value">{book.format}</span>
              </div>
              <div className="detail-item">
                <span className="label">Trọng lượng:</span>
                <span className="value">{book.weight}</span>
              </div>
              <div className="detail-item">
                <span className="label">Bộ sách:</span>
                <span className="value">{book.series}</span>
              </div>
            </div>

            <div className="quantity-control">
              <span className="label">Số lượng:</span>
              <div className="quantity-buttons">
                <button onClick={() => handleQuantityChange(-1)} disabled={quantity <= 1}>
                  -
                </button>
                <input type="text" value={quantity} readOnly />
                <button onClick={() => handleQuantityChange(1)}>+</button>
              </div>
            </div>

            <div className="book-actions">
              {isInCart ? (
                <button className="remove-from-cart-btn" onClick={removeFromCart}>
                  <FaTrash /> Xóa khỏi giỏ hàng
                </button>
              ) : (
                <button className="add-to-cart-btn" onClick={addToCart}>
                  <FaShoppingCart /> Thêm vào giỏ hàng
                </button>
              )}
              <button className="buy-now-btn">ĐẶT HÀNG NGAY</button>
              <button className="wishlist-btn">
                <FaHeart /> Thêm vào yêu thích
              </button>
            </div>
          </div>
        </div>

        <div className="book-description">
          <h2>MÔ TẢ</h2>
          <p>{book.description}</p>
        </div>

        <div className="book-reviews">
          <h2>ĐÁNH GIÁ</h2>
          <div className="reviews-container">
            <div className="review-item">
              <div className="reviewer">
                <div className="avatar">N</div>
                <div className="name">Nguyễn Văn A</div>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < 5 ? "filled" : ""}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="review-content">
                <p>Sách rất hay, in đẹp, giao hàng nhanh!</p>
                <span className="review-date">Đánh giá vào: 20/01/2023</span>
              </div>
            </div>

            <div className="review-item">
              <div className="reviewer">
                <div className="avatar">T</div>
                <div className="name">Trần Thị B</div>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < 4 ? "filled" : ""}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="review-content">
                <p>Nội dung hay, nhưng bìa hơi bị cong.</p>
                <span className="review-date">Đánh giá vào: 15/01/2023</span>
              </div>
            </div>

            <div className="review-item">
              <div className="reviewer">
                <div className="avatar">P</div>
                <div className="name">Phạm Văn C</div>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className={`star ${i < 5 ? "filled" : ""}`}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              <div className="review-content">
                <p>Truyện rất cuốn, đọc một mạch từ đầu đến cuối!</p>
                <span className="review-date">Đánh giá vào: 05/01/2023</span>
              </div>
            </div>
          </div>
        </div>

        <div className="related-books">
          <h2>SÁCH CÙNG THỂ LOẠI</h2>
          <div className="book-grid">
            {relatedBooks.map((book) => (
              <div className="book-card" key={book.id}>
                <Link to={`/sach/${book.id}`}>
                  <div className="book-image">
                    <img src={book.image || "/placeholder.svg"} alt={book.title} />
                  </div>
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-price">{formatPrice(book.price)}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="viewed-books">
          <h2>SẢN PHẨM ĐÃ XEM</h2>
          <div className="book-grid">
            {viewedBooks.map((book) => (
              <div className="book-card" key={book.id}>
                <Link to={`/sach/${book.id}`}>
                  <div className="book-image">
                    <img src={book.image || "/placeholder.svg"} alt={book.title} />
                  </div>
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-price">{formatPrice(book.price)}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>

        <div className="series-books">
          <h2>SẢN PHẨM CÙNG BỘ</h2>
          <div className="book-grid">
            {seriesBooks.map((book) => (
              <div className="book-card" key={book.id}>
                <Link to={`/sach/${book.id}`}>
                  <div className="book-image">
                    <img src={book.image || "/placeholder.svg"} alt={book.title} />
                  </div>
                  <div className="book-info">
                    <h3 className="book-title">{book.title}</h3>
                    <p className="book-price">{formatPrice(book.price)}</p>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(BookDetail)

