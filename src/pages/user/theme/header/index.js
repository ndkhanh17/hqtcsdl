"use client"

import { memo, useEffect, useRef, useState } from "react"
import { FaHeart, FaShoppingCart } from "react-icons/fa"
import { Link, useLocation } from "react-router-dom"
import { ROUTERS } from "utils/router"
import "./style.scss"

const Header = () => {
  const location = useLocation()
  const [menu] = useState([
    { name: "Trang Chủ", path: ROUTERS.USER.HOME },
    { name: "Liên hệ với chúng tôi", path: ROUTERS.USER.CONTACT },
  ])
  const [isOpen, setIsOpen] = useState(false)
  const [cartCount, setCartCount] = useState(0)
  const headerRef = useRef(null)

  // Lấy số lượng sản phẩm trong giỏ hàng từ localStorage
  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    setCartCount(cart.length)
  }, [location])

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (headerRef.current && !headerRef.current.contains(event.target) && isOpen) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [isOpen])

  return (
    <>
      <button className="menu-toggle" onClick={toggleMenu} aria-label="Mở menu">
        ☰
      </button>
      <header className={`header ${isOpen ? "open" : ""}`} ref={headerRef}>
        <div className="container">
          <div className="row">
            <div className="header_logo">
              <Link to={ROUTERS.USER.HOME}>
                <h1>AyaBook</h1>
              </Link>
            </div>
            <nav className="header_menu">
              <ul>
                {menu?.map((menuItem, menuKey) => {
                  return (
                    <li key={menuKey} className={location.pathname === menuItem.path ? "active" : ""}>
                      <Link to={menuItem?.path}>{menuItem?.name}</Link>
                    </li>
                  )
                })}
              </ul>
            </nav>
            <div className="header_actions">
              <Link to={ROUTERS.USER.CART} className="cart-icon">
                <FaShoppingCart />
                {cartCount > 0 && <span className="cart-count">{cartCount}</span>}
              </Link>
              <Link to="/wishlist" className="wishlist-icon">
                <FaHeart />
              </Link>
              <div className="header_login">
                <ul>
                  <li>
                    <Link to={ROUTERS.USER.SIGNIN}>Đăng nhập</Link>
                  </li>
                  <li>
                    <Link to={ROUTERS.USER.SIGNUP}>Đăng ký</Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  )
}
export default memo(Header)

