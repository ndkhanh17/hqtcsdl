"use client"

import { memo, useState } from "react"
import "./style.scss"
import { ROUTERS } from "utils/router"
import { MdOutlineDisabledByDefault } from "react-icons/md"
import { Link, useNavigate } from "react-router-dom"

const Signin = () => {
  const [passwordVisible, setPasswordVisible] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })
  const [errors, setErrors] = useState({})
  const navigate = useNavigate()

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible)
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })

    // Xóa lỗi khi người dùng nhập lại
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      })
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Vui lòng nhập email"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ"
    }

    if (!formData.password) {
      newErrors.password = "Vui lòng nhập mật khẩu"
    }

    return newErrors
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Mô phỏng đăng nhập thành công
    localStorage.setItem("isLoggedIn", "true")
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: formData.email,
        name: "Người dùng",
      }),
    )

    navigate(ROUTERS.USER.HOME)
  }

  const handleExitClick = () => {
    navigate(ROUTERS.USER.HOME)
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <h1>CHÀO MỪNG BẠN ĐẾN VỚI AYA BOOK</h1>
        </div>

        <div className="login-form-container">
          <button className="exit-button" onClick={handleExitClick}>
            <MdOutlineDisabledByDefault />
          </button>

          <h2>Đăng nhập</h2>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <div className="input-with-icon">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Nhập email của bạn"
                  className={errors.email ? "error" : ""}
                />
              </div>
              {errors.email && <div className="error-message">{errors.email}</div>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Mật khẩu</label>
              <div className="input-with-icon password-input">
                <span className="input-icon">🔒</span>
                <input
                  type={passwordVisible ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Nhập mật khẩu của bạn"
                  className={errors.password ? "error" : ""}
                />
                <button type="button" className="toggle-password" onClick={togglePasswordVisibility}>
                  {passwordVisible ? "👁️" : "👁️‍🗨️"}
                </button>
              </div>
              {errors.password && <div className="error-message">{errors.password}</div>}
            </div>

            <div className="form-options">
              <div className="remember-me">
                <input
                  type="checkbox"
                  id="rememberMe"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                />
                <label htmlFor="rememberMe">Nhớ mật khẩu</label>
              </div>

              <a href="/quen-mat-khau" className="forgot-password">
                Quên mật khẩu
              </a>
            </div>

            <button type="submit" className="login-button">
              Đăng nhập
            </button>
          </form>

          <div className="register-link">
            <p>
              Không nhớ tài khoản? <Link to={ROUTERS.USER.SIGNUP}>Đăng ký ngay</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(Signin)

