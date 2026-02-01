import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import ProductModal from "../../components/ProductModal";
import Pagination from "../../components/Pagination";
import DelProductModal from "../../components/DelProductModal";
import ProdectTable from "../../components/ProductTable";
import Login from "./Login";

const env = import.meta.env;
const { VITE_API_BASE, VITE_API_PATH } = env;

function Admin() {
  //錯誤訊息
  const [message, setMessage] = useState("");

  //分頁導覽
  const [pagination, setPagination] = useState({});

  //取得資料邏輯
  const [products, setProducts] = useState([]);
  const getProducts = async (page = 1) => {
    try {
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/products?page=${page}`);
      setProducts(res.data.products);
      setPagination(res.data.pagination);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "取得產品失敗，請稍後再試";
      setMessage(errorMsg);
    }
  };

  //單一產品顯示
  // const [tempProduct, setTempProduct] = useState({});

  //登入驗證
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // 取得 Cookie 裡的 Token
    // eslint-disable-next-line
    const token = document.cookie.replace(/(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/, "$1");

    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      // 檢查登入 API
      axios
        .post(`${VITE_API_BASE}/api/user/check`)
        .then(() => {
          setIsAuth(true); // 驗證成功，變回登入狀態
          getProducts();
        })
        .catch(() => {
          setMessage("登入逾期，請重新登入");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      // eslint-disable-next-line
      setIsLoading(false); // 沒 token 也要關閉載入，顯示登入頁
    }
  }, []); // [] 代表只在「網頁剛打開」時執行一次

  // 打開刪除 Modal
  const openDelModal = (product) => {
    setTempDelProduct(product); // 存入當前點擊的產品
    delModalInstance.current.show();
  };

  // 關閉刪除 Modal
  const closeDelModal = () => {
    delModalInstance.current.hide();
  };

  // 暫存要刪除的產品資料
  const [tempDelProduct, setTempDelProduct] = useState({});

  //編輯和新增功能

  //modal ref
  // const productModalRef = useRef(null); //HTML 標籤
  const modalInstance = useRef(null); //遙控器
  const delModalInstance = useRef(null);

  useEffect(() => {
    if (isAuth) {
      modalInstance.current = new Modal("#productModal");
      delModalInstance.current = new Modal("#delProductModal");
    }
  }, [isAuth]);

  //資料暫存區
  const [modalData, setModalData] = useState({
    title: "",
    category: "",
    origin_price: 0,
    price: 0,
    unit: "顆",
    description: "",
    content: "",
    is_enabled: 1,
    imageUrl: "",
    imagesUrl: [],
    marketing_tag: "none",
  });

  //新增資料格式區
  const defaultModalData = {
    title: "",
    category: "",
    unit: "",
    origin_price: 0,
    price: 0,
    description: "",
    content: "",
    is_enabled: 0,
    imageUrl: "",
    imagesUrl: [],
    marketing_tag: "none",
  };

  //modal打開函式
  const openModal = (mode, product = null) => {
    if (mode === "new") {
      setModalData(defaultModalData);
    } else {
      // 編輯模式：放入選中的產品資料
      setModalData({
        ...product,
        imagesUrl: product.imagesUrl ? product.imagesUrl.filter((url) => url !== "") : [],
      });
    }
    // 資料跑完才能打開
    modalInstance.current.show();
  };

  //modal關閉函式
  const closeModal = () => {
    modalInstance.current.hide();
  };

  if (isLoading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
        >
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="ms-2 mb-0">驗證中，請稍後...</p>
      </div>
    );
  }

  return (
    <>
      {isAuth ? (
        <div className="container mt-5">
          <div className="row">
            <button
              className="btn btn-info fw-bold w-auto mb-3"
              onClick={() => openModal("new")}
            >
              建立新產品
            </button>
            <hr />
            <ProdectTable
              products={products}
              openModal={openModal}
              openDelModal={openDelModal}
            />
            <Pagination
              pagination={pagination}
              onChangePage={getProducts}
            />
          </div>
        </div>
      ) : (
        <Login
          setIsAuth={setIsAuth}
          getProducts={getProducts}
          setMessage={setMessage}
          message={message}
        />
      )}
      <ProductModal
        modalData={modalData}
        closeModal={closeModal}
        getProducts={getProducts}
        modalInstance={modalInstance}
      />
      <DelProductModal
        closeDelModal={closeDelModal}
        getProducts={getProducts}
        tempDelProduct={tempDelProduct}
      />
    </>
  );
}
export default Admin;
