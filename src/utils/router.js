export const ADMIN_PATH = "/quan-tri"

export const ROUTERS = {
  USER: {
    HOME: "/",
    SHOP: "/cua-hang",
    ABOUT: "/ve-chung-toi",
    CONTACT: "/lien-he",
    SIGNUP: "/dang-ky-tai-khoan",
    SIGNIN: "/dang-nhap",
    CHECKOUT: "/thanh-toan",
    PROFILE: "/thong-tin-ca-nhan",
    BOOK_DETAIL: "/sach/:id",
    CART: "/gio-hang",
    ORDER_SUCCESS: "/dat-hang-thanh-cong",
    ORDER_HISTORY: "/lich-su-mua-hang",
  },

  ADMIN: {
    LOGIN: `${ADMIN_PATH}/dang-nhap`,
    DASHBOARD: `${ADMIN_PATH}/dashboard`,
    BOOKS: `${ADMIN_PATH}/quan-ly-sach`,
    ADD_BOOK: `${ADMIN_PATH}/them-sach`,
    ORDERS: `${ADMIN_PATH}/don-hang`,
    CUSTOMERS: `${ADMIN_PATH}/khach-hang`,
    CATEGORIES: `${ADMIN_PATH}/danh-muc`,
    STATISTICS: `${ADMIN_PATH}/thong-ke`,
  },
}

