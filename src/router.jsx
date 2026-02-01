import { createHashRouter } from "react-router-dom";
import FrontendLayout from "./layout/FrontendLayout";
import Home from "./views/front/Home";
import Products from "./views/front/Products";
import SingleProduct from "./views/front/SingleProduct";
import Cart from "./views/front/Cart";
import Admin from "./views/back/admin";
import NotFound from "./views/front/NotFound";
const router = createHashRouter([
  {
    path: "/",
    element: <FrontendLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "Products",
        element: <Products />,
      },
      {
        path: "Product/:id",
        element: <SingleProduct />,
      },
      {
        path: "cart",
        element: <Cart />,
      },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "Admin",
    element: <Admin />,
  },
]);

export default router;
