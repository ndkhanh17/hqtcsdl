"use client"

import { memo, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { formatPrice } from "utils/formatter";
import banner1 from "../../../assets/user/img/banner.png";
import "./style.scss";
const HomePage = () => {
  const [newBooks, setNewBooks] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [mangaCollection, setMangaCollection] = useState([])
  const [selfHelpBooks, setSelfHelpBooks] = useState([])
  const [featuredBook, setFeaturedBook] = useState(null)

  useEffect(() => {
    window.scrollTo(0, 0)

    // Mô phỏng dữ liệu sách mới
    const mockNewBooks = [
      {
        id: 1,
        title: "Nina ở thị trấn cao nguyên - Tập 2",
        price: 34200,
        image: banner1,
        category: "Manga",
        

      },
      {
        id: 2,
        title: "Những ngày tết ta",
        price: 81000,
        image: banner1,
        category: "Văn hóa",
      },
      {
        id: 3,
        title: "World Trigger - Tập 4",
        price: 31500,
        image: banner1,
        category: "Manga",
      },
      {
        id: 4,
        title: "Những người bạn từ trang sách",
        price: 85500,
        image: banner1,
        category: "Tiểu thuyết",
      },
    ]

    // Mô phỏng dữ liệu sách bán chạy
    const mockBestSellers = [
      {
        id: 5,
        title: "Shin - Cậu bé bút chì - Tập 1",
        price: 19500,
        image: banner1,
        category: "Manga",
      },
      {
        id: 6,
        title: "Naruto - Quyển 20",
        price: 21000,
        image: banner1,
        category: "Manga",
      },
      {
        id: 7,
        title: "One Piece - Tập 101",
        price: 23000,
        image: banner1,
        category: "Manga",
      },
      {
        id: 8,
        title: "Chú thuật hồi chiến - Tập 1",
        price: 30000,
        image: banner1,
        category: "Manga",
      },
    ]

    // Mô phỏng dữ liệu bộ sưu tập manga
    const mockMangaCollection = [
      {
        id: 9,
        title: "Xe buýt dừa em đi",
        price: 36000,
        image: banner1,
        category: "Manga",
      },
      {
        id: 10,
        title: "Ninja Rantaro - Tập 19",
        price: 36000,
        image: banner1,
        category: "Manga",
      },
      {
        id: 11,
        title: "Doctor Stone - Tập 21",
        price: 22500,
        image: banner1,
        category: "Manga",
      },
      {
        id: 12,
        title: "Đội quân Doraemon - Tập 4",
        price: 19800,
        image: banner1,
        category: "Manga",
      },
    ]

    // Mô phỏng dữ liệu sách kỹ năng sống
    const mockSelfHelpBooks = [
      {
        id: 13,
        title: "Thiền định mỗi ngày",
        price: 118000,
        image: banner1,
        category: "Kỹ năng sống",
      },
      {
        id: 14,
        title: "Một năm sống tử tế",
        price: 168000,
        image: banner1,
        category: "Kỹ năng sống",
      },
      {
        id: 15,
        title: "Thay đổi cuộc sống với nhân số học",
        price: 181400,
        image: banner1,
        category: "Kỹ năng sống",
      },
      {
        id: 16,
        title: "Dám nghĩ lại",
        price: 179600,
        image: "/placeholder.svg?height=300&width=200",
        category: "Kỹ năng sống",
      },
    ]

    // Sách nổi bật
    const mockFeaturedBook = {
      id: 17,
      title: "Hạnh phúc và bản tính con người",
      description:
        "Hạnh phúc không phải là một trạng thái vĩnh viễn, mà là một hành trình. Đôi khi, con người có thể đạt được hạnh phúc thông qua các hành động nhỏ bé hàng ngày.",
      price: 98000,
      year: 2023,
      image: banner1,
      category: "Tâm lý học",
    }

    setNewBooks(mockNewBooks)
    setBestSellers(mockBestSellers)
    setMangaCollection(mockMangaCollection)
    setSelfHelpBooks(mockSelfHelpBooks)
    setFeaturedBook(mockFeaturedBook)
  }, [])

  return (
    <div className="homepage-content">
      {featuredBook && (
        <section className="featured-book">
          <div className="container">
            <div className="featured-content">
              <div className="featured-images">
                <img
                  src={featuredBook.image || banner1}
                  alt={featuredBook.title}
                  className="featured-image"
                />
                <img
                  src={featuredBook.image || banner1}
                  alt={featuredBook.title}
                  className="featured-image-shadow"
                />
              </div>
              <div className="featured-text">
                <h2>"{featuredBook.title}"</h2>
                <p>{featuredBook.description}</p>
                <div className="featured-info">
                  <div className="price">
                    <span>Niêm yết giá:</span>
                    <strong>{formatPrice(featuredBook.price)}</strong>
                  </div>
                  <div className="year">
                    <span>Năm xuất bản:</span>
                    <strong>{featuredBook.year}</strong>
                  </div>
                </div>
                <Link to={`/sach/${featuredBook.id}`} className="cta-button">
                  Mua ngay
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="book-section">
        <div className="container">
          <h2 className="section-title">SÁCH MỚI</h2>
          <div className="book-grid">
            {newBooks.map((book) => (
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
      </section>

      <section className="book-section">
        <div className="container">
          <h2 className="section-title">BÁN CHẠY NHẤT</h2>
          <div className="book-grid">
            {bestSellers.map((book) => (
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
      </section>

      <section className="book-section manga-section">
        <div className="container">
          <h2 className="section-title">MANGA COLLECTION</h2>
          <p className="section-subtitle">Bộ sưu tập dành cho fan mê truyện tranh</p>
          <div className="book-grid">
            {mangaCollection.map((book) => (
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
      </section>

      <section className="book-section self-help-section">
        <div className="container">
          <h2 className="section-title">SÁCH VỀ KỸ NĂNG SỐNG CHO GIỚI TRẺ</h2>
          <div className="book-grid">
            {selfHelpBooks.map((book) => (
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
      </section>
    </div>
  )
}

export default memo(HomePage)

