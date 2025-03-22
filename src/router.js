import BookDetail from "pages/user/book-detail"
import Cart from "pages/user/cart"
import Checkout from "pages/user/checkout"
import Contact from "pages/user/contact"
import OrderSuccess from "pages/user/order-success"
import Signin from "pages/user/signin"
import Signup from "pages/user/signup"
import { Route, Routes, useLocation } from "react-router-dom"
import HomePage from "./pages/user/homepage"
import MasterUserLayout from "./pages/user/theme/masterLayout"
import { ADMIN_PATH, ROUTERS } from "./utils/router"

import MasterAdminLayout from "pages/admin/theme/masterLayout"

import AddBook from "pages/admin/add-book"
import Books from "pages/admin/books"
import Dashboard from "pages/admin/dashboard"
import Login from "pages/admin/login"
import Orders from "pages/admin/orders"


const renderUserRouter = () => {
  const UserRouters = [
    {
      path: ROUTERS.USER.HOME,
      component: <HomePage />,
    },

    {
      path: ROUTERS.USER.SIGNUP,
      component: <Signup />,
    },
    {
      path: ROUTERS.USER.SIGNIN,
      component: <Signin />,
    },
    {
      path: ROUTERS.USER.CHECKOUT,
      component: <Checkout />,
    },
    {
      path: ROUTERS.USER.BOOK_DETAIL,
      component: <BookDetail />,
    },
    {
      path: ROUTERS.USER.CART,
      component: <Cart />,
    },
    {
      path: ROUTERS.USER.ORDER_SUCCESS,
      component: <OrderSuccess />,
    },
    {
      path: ROUTERS.USER.CONTACT,
      component: <Contact />,
    },
    
  ]
  return (
    <MasterUserLayout>
      <Routes>
        {UserRouters.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Routes>
    </MasterUserLayout>
  )
}

const renderAdminRouter = () => {
  const AdminRouters = [
    {
      path: ROUTERS.ADMIN.LOGIN,
      component: <Login />,
    },
    {
      path: ROUTERS.ADMIN.DASHBOARD,
      component: <Dashboard />,
    },
    {
      path: ROUTERS.ADMIN.BOOKS,
      component: <Books />,
    },
    {
      path: ROUTERS.ADMIN.ADD_BOOK,
      component: <AddBook />,
    },
    {
      path: ROUTERS.ADMIN.ORDERS,
      component: <Orders />,
    },
 
   
  ]
  return (
    <MasterAdminLayout>
      <Routes>
        {AdminRouters.map((item, key) => (
          <Route key={key} path={item.path} element={item.component} />
        ))}
      </Routes>
    </MasterAdminLayout>
  )
}

const RouterCustom = () => {
  const location = useLocation()
  const isAdminRouter = location.pathname.startsWith(ADMIN_PATH)

  return isAdminRouter ? renderAdminRouter() : renderUserRouter()
}

export default RouterCustom

