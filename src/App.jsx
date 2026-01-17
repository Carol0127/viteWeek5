import { useState, useEffect,useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap"; 

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "yihan";

function App() {
  //登入格式
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  //登入-取值
   const handleChange = (e) => {
    // input 的 name 屬性 (mail 或password)
    // vlue使用者輸入的文字
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  //登入-讀取+送出+取得產品資料
  const signin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      // 取得 token 並存入 cookie
      const { token, expired } = res.data;
      // eslint-disable-next-line
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      //之後需驗證的都會帶上token
      // eslint-disable-next-line
      axios.defaults.headers.common["Authorization"] = token;
      //驗證成功
      setIsAuth(true);
      //取得產品資料
      getProducts();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "登入失敗，請重試";
      setMessage(errorMsg);
    }
  };

  //錯誤訊息
  const [message, setMessage] = useState("");

  //取得資料邏輯
  const [products, setProducts] = useState([]);
  const getProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`);
      setProducts(res.data.products);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || "取得產品失敗，請稍後再試";
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
    const token = document.cookie.replace(
      /(?:(?:^|.*;\s*)hexToken\s*\=\s*([^;]*).*$)|^.*$/,
      "$1"
    );

    if (token) {
      axios.defaults.headers.common["Authorization"] = token;
      // 檢查登入 API
      axios
        .post(`${API_BASE}/api/user/check`)
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
    }else {
    setIsLoading(false); // 沒 token 也要關閉載入，顯示登入頁
  }
  }, []); // [] 代表只在「網頁剛打開」時執行一次

  //刪除功能
  const delProduct = async () => {
      try {
        await axios.delete(
          `${API_BASE}/api/${API_PATH}/admin/product/${tempDelProduct.id}`
        );
      getProducts();
      closeDelModal(); 
    } catch (error) {
      const errorMsg = error.response?.data?.message || "刪除失敗";
      alert(errorMsg);
    }
  };
  // 暫存要刪除的產品資料
  const [tempDelProduct, setTempDelProduct] = useState({});

  // 打開刪除 Modal
  const openDelModal = (product) => {
    setTempDelProduct(product); // 存入當前點擊的產品
    delModalInstance.current.show();
  };

  // 關閉刪除 Modal
  const closeDelModal = () => {
    delModalInstance.current.hide();
  };

  //編輯和新增功能

  //modal ref
  const productModalRef = useRef(null); //HTML 標籤
  const modalInstance = useRef(null); //遙控器
  const delProductModalRef = useRef(null); 
  const delModalInstance = useRef(null);
  useEffect(() => {
    // 當 isAuth 為 true (登入後)，HTML 才會出現，這時綁定 Modal
    if (productModalRef.current) {
      modalInstance.current = new Modal(productModalRef.current);
    }
    if (delProductModalRef.current) {
    delModalInstance.current = new Modal(delProductModalRef.current);
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
    imagesUrl: []
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
};

  //modal打開函式
  const openModal = (mode, product = null) => {
    if (mode === 'new') {
      setModalData(defaultModalData);
    } else {
      // 編輯模式：放入選中的產品資料
      setModalData({
         ...product,
         imagesUrl: product.imagesUrl ? product.imagesUrl.filter(url => url !== "") : []
         });
    }
    // 資料跑完才能打開
    modalInstance.current.show();
  };

  //modal關閉函式
  const closeModal = () => {
    modalInstance.current.hide();
  };

  // Modal內的輸入改值函式
  const handleModalInputChange = (e) => {
  const { name, value, type, checked } = e.target;

    // 檢查是否為多圖欄位
    if (name.startsWith("imagesUrl_")) {
      const index = parseInt(name.split("_")[1]); // 取得它是第幾張圖
      const newImagesUrl = [...modalData.imagesUrl]; // 拷貝陣列
      newImagesUrl[index] = value; // 修改索引的值

      setModalData({
        ...modalData,
        imagesUrl: newImagesUrl,
      });
    } else {
      // 一般欄位的處理
      setModalData({
        ...modalData,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : type === "number" ? Number(value) : value,
      });
    }
  };

  // 新增圖片欄位
const addImage = () => {
  const newImagesUrl = [...modalData.imagesUrl];
  newImagesUrl.push(""); // 增加一個空字串
  setModalData({
    ...modalData,
    imagesUrl: newImagesUrl
  });
};

// 移除最後一張圖
const removeImage = () => {
  const newImagesUrl = [...modalData.imagesUrl];
  newImagesUrl.pop(); // 移除最後一項
  setModalData({
    ...modalData,
    imagesUrl: newImagesUrl
  });
};


  //更新啟動函式
  const saveProduct = async () => {

  const isEdit = !!modalData.id; 
  //API 參數
  const method = isEdit ? "put" : "post";
  const url = isEdit 
    ? `${API_BASE}/api/${API_PATH}/admin/product/${modalData.id}`
    : `${API_BASE}/api/${API_PATH}/admin/product`;

    const cleanedData = {
    ...modalData,
    imagesUrl: modalData.imagesUrl.filter(url => url.trim() !== "")
  };

  try {
    // 發送請求 (資料必須包在 data 屬性裡)
    const res = await axios[method](url, { data: cleanedData });  
    alert(res.data.message);
    modalInstance.current.hide(); // 存檔成功，關閉視窗
    getProducts();
    
  } catch (error) {
    alert("儲存失敗：" + error.response.data.message);
  }
  };

  if (isLoading) {
  return (
    <div className="d-flex justify-content-center align-items-center" style={{height: '100vh'}}>
      <div className="spinner-border text-primary" role="status">
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
                  onClick={() => openModal('new')} 
                >
                  建立新產品
                </button>
              <hr />
              <table className="table table-striped table-hover text-center align-middle">
                <thead>
                  <tr>
                    <th>產品名稱</th>
                    <th>類別</th>
                    <th>原價</th>
                    <th>售價</th>
                    <th>是否啟用</th>
                    <th>產品調整</th>
                  </tr>
                </thead>
                <tbody>
                  {products.length > 0 ? (
                    products.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
                        <td>{item.category}</td>
                        <td>{item.origin_price}</td>
                        <td>{item.price}</td>
                        <td>
                          {item.is_enabled ? (
                            <span className="text-success">啟用</span>
                          ) : (
                            <span className="text-secondary">未啟用</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-outline-primary btn-sm mb-2 mb-lg-0 me-lg-2"
                            onClick={() => openModal('edit',item)}
                          >
                            編輯
                          </button>
                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => openDelModal(item)}
                          >
                            刪除
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-secondary">
                        目前沒有產品資料
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            {/* 新增 編輯 modal */}
            <div id="productModal" ref={productModalRef} className="modal fade" tabIndex="-1">
              <div className="modal-dialog modal-xl">
                <div className="modal-content">
                  <div className={`modal-header ${modalData.id ? 'bg-primary text-white' : 'bg-info text-black'}`}>
                    <h5 className="modal-title ">{modalData.id ? "編輯產品" : "新增產品"}</h5>
                    <button type="button" className="btn-close" onClick={closeModal}></button>
                  </div>
                  <div className="modal-body">
                    <div className="row">
                      <div className="col-4">
                        <div className="mb-3">
                          <label className="form-label">主圖網址</label>
                          <input
                            name="imageUrl"
                            value={modalData.imageUrl || ""}
                            onChange={handleModalInputChange}
                            type="text"
                            className="form-control"
                          />
                          {modalData.imageUrl && (
                            <img 
                              className="mt-3" 
                              src={modalData.imageUrl} 
                              alt={modalData.title} 
                              style={{ width: "100px", height: "100px", objectFit: "cover" }} 
                            />
                          )}
                        </div>
                        {modalData.imagesUrl.map((url, index)=>(
                          <div className="mb-3" key={index}>
                            <label className="form-label">圖片網址 {index + 1}</label>
                            <input
                              name={`imagesUrl_${index}`} 
                              value={url || ""}
                              onChange={handleModalInputChange}
                              type="text"
                              className="form-control"
                            />
                            {/* 如果有網址，就顯示小圖預覽 */}
                            {url && (
                              <img 
                                src={url} 
                                alt={`預覽圖 ${index + 1}`} 
                                className="img-fluid mt-2" 
                                style={{ width: "100px", height: "100px", objectFit: "cover" }} 
                              />
                            )}
                          </div>
                        ))}
                        {/* 動態按鈕控制 */}
                        <div className="d-flex justify-content-between">
                          {/* 限制最多 5 張，且最後一個欄位有填寫內容才允許新增下一個 */}
                          {modalData.imagesUrl.length < 5 && 
                          (modalData.imagesUrl.length === 0 || modalData.imagesUrl[modalData.imagesUrl.length - 1]) && (
                            <button className="btn btn-outline-primary btn-sm w-100 me-2" onClick={addImage}>
                              新增圖片
                            </button>
                          )}
                          
                          {/* 如果有欄位才顯示移除按鈕 */}
                          {modalData.imagesUrl.length > 0 && (
                            <button className="btn btn-outline-danger btn-sm w-100" onClick={removeImage}>
                              移除最後一張
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="col-8">
                        <div className="mb-3">
                          <label className="form-label">產品名稱</label>
                          <input
                            name="title"
                            value={modalData.title || ""}
                            onChange={handleModalInputChange}
                            type="text"
                            className="form-control"
                          />
                        </div>
                        <div className="row">
                          <div className="mb-3 col-6">
                          <label className="form-label">分類</label>
                          <input
                            name="category"
                            value={modalData.category || ""}
                            onChange={handleModalInputChange}
                            type="text"
                            className="form-control"
                          />
                          </div>
                          <div className="mb-3 col-6">
                          <label className="form-label">單位</label>
                          <input
                            name="unit"
                            value={modalData.unit || ""}
                            onChange={handleModalInputChange}
                            type="text"
                            className="form-control"
                          />
                          </div>
                        </div>
                        <div className="mb-3">
                          <label className="form-label">內容</label>
                          <textarea
                              name="content"
                              value={modalData.content || ""}
                              onChange={handleModalInputChange}
                              className="form-control"
                              rows="4"
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">描述</label>
                          <textarea
                              name="description"
                              value={modalData.description || ""}
                              onChange={handleModalInputChange}
                              className="form-control"
                              rows="4"
                          />
                        </div>
                        <div className="row">
                          <div className="mb-3 col-6">
                            <label className="form-label">原價</label>
                            <input
                              name="origin_price"
                              value={modalData.origin_price || 0}
                              onChange={handleModalInputChange}
                              type="number"
                              className="form-control"
                            />
                          </div>
                          <div className="mb-3 col-6">
                            <label className="form-label">售價</label>
                            <input
                              name="price"
                              value={modalData.price || 0}
                              onChange={handleModalInputChange}
                              type="number"
                              className="form-control"
                            />
                          </div>
                          <div className="mb-3">
                          <div className="form-check">
                            <input
                              name="is_enabled"
                              checked={modalData.is_enabled === 1}
                              onChange={handleModalInputChange}
                              className="form-check-input"
                              type="checkbox"
                              id="is_enabled_check"
                            />
                            <label className="form-check-label" htmlFor="is_enabled_check">
                              是否啟用
                            </label>
                          </div>
                        </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={closeModal}>
                      取消
                    </button>
                    <button type="button" className="btn btn-primary" onClick={saveProduct}>
                      {modalData.id ? "確認更新" : "確認新增"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
            {/* 刪除 Modal */}
            <div id="delProductModal" ref={delProductModalRef} className="modal fade" tabIndex="-1">
              <div className="modal-dialog ">
                <div className="modal-content border-0">
                  <div className="modal-header bg-danger text-white">
                    <h5 className="modal-title">
                      <span>刪除產品</span>
                    </h5>
                    <button type="button" className="btn-close" onClick={closeDelModal}></button>
                  </div>
                  <div className="modal-body">
                    是否刪除
                    <strong className="text-danger"> {tempDelProduct.title} </strong>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-outline-secondary" onClick={closeDelModal}>
                      取消
                    </button>
                    <button type="button" className="btn btn-danger" onClick={delProduct}>
                      確認刪除
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="container mt-5">
          <h2 className="mb-3 fw-bold">請先登入</h2>
          <form onSubmit={signin}>
            <div className="mb-3">
              <label htmlFor="mail" className="form-label">
                電子信箱
              </label>
              <input
                type="email"
                className="form-control"
                id="mail"
                name="username"
                placeholder="name@example.com"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </div>
            <div className="mb-3">
              <label htmlFor="password" className="form-label">
                密碼
              </label>
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary mb-3">
              登入
            </button>
            {message && <div className="alert alert-danger p-2">{message}</div>}
          </form>
        </div>
      )}
    </>
  );
}
export default App;
