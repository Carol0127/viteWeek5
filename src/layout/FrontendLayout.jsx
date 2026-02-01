import { Outlet, NavLink } from "react-router-dom";
import logoSquare from "../assets/logo正.png";
function FrontendLayout() {
  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          {/* 1. Logo 在最左側 */}
          <NavLink
            className="navbar-brand"
            to="/"
          >
            <img
              src={logoSquare}
              style={{ width: "80px" }}
              alt="logo"
            />
          </NavLink>

          {/* 手機版選單按鈕 (漢堡選單) */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div
            className="collapse navbar-collapse"
            id="navbarNav"
          >
            {/* 2. 中間選單：使用 mx-auto 讓它推到中間 */}
            <ul className="navbar-nav align-items-center mx-auto">
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/"
                >
                  首頁
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/Products"
                >
                  我們的商品
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  className="nav-link"
                  to="/Cart"
                >
                  購物車
                </NavLink>
              </li>
            </ul>

            {/* 3. 會員圖標：放在 ul 外面或給予獨立空間，使用 d-flex 確保排版 */}
            <div className="navbar-nav align-items-center">
              <NavLink
                className="nav-link"
                to="/admin"
              >
                <i
                  style={{ fontSize: "20px" }}
                  className="bi bi-person-fill"
                ></i>
              </NavLink>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      <footer className="mt-auto py-2 text-center text-white-50 bg-primary">
        <p className="m-0">copyright</p>
      </footer>
    </>
  );
}

export default FrontendLayout;
