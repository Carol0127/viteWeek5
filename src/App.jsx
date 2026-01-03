import { useState } from "react";
import axios from "axios";

const API_BASE = "https://ec-course-api.hexschool.io/v2"
const API_PATH = "yihan"

function App() {
  
  //登入功能
  const [formData, setFormData] = useState({
    "username": "",
    "password": ""
  });
  //登入-取值
  function handleChange(e){
  // input 的 name 屬性 (mail 或password)
  // vlue使用者輸入的文字
    const { name, value } = e.target;
    setFormData({
    ...formData,      
    [name]: value     
    });
  };
  //登入-讀取+送出+取得產品資料
  const signin = async function(e) {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      // 取得 token 並存入 cookie
      const { token, expired } = res.data;
      // eslint-disable-next-line
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      //之後需驗證的都會帶上token
      // eslint-disable-next-line
      axios.defaults.headers.common['Authorization'] = token;
      //驗證成功
      setIsAuth(true);
      //取得產品資料
      getProducts()
    } catch (error) {
      const errorMsg = error.response?.data?.message || "登入失敗，請重試";
  setMessage(errorMsg);
    }
  }

  //錯誤訊息
  const [message, setMessage] = useState('');

  //登入驗證
  const [isAuth, setIsAuth] = useState(false);

  //取得資料邏輯
  const [products,setProducts] = useState([]);
  const getProducts = async function(){
    try {
      const res = await axios.get(`${API_BASE}/api/${API_PATH}/admin/products`)
      setProducts(res.data.products);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "取得產品失敗，請稍後再試";
      setMessage(errorMsg);
    }
  }

  //單一產品顯示
  const [tempProduct, setTempProduct] = useState({});

  return(
    <>
        {isAuth ? (
          <div className="container mt-5">
            <div className="row">
              <div className="col-6">
                <table className="table">
                  <thead>
                    <tr>
                      <th>產品名稱</th>
                      <th>原價</th>
                      <th>售價</th>
                      <th>是否啟用</th>
                      <th>查看細節</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.length > 0 ? (
                    products.map((item) => (
                      <tr key={item.id}>
                        <td>{item.title}</td>
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
                            className="btn btn-primary btn-sm"
                            onClick={() => setTempProduct(item)}
                          >
                            查看細節
                          </button>
                        </td>
                      </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center text-secondary">
                          目前沒有產品資料
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
{/* 單一產品 */}
              <div className="col-6">
                <h2>單一產品細節</h2>
                {tempProduct.id ? (
                  <div className="card">
                    <img 
                      src={tempProduct.imageUrl} 
                      className="card-img-top img-fluid" 
                      alt={tempProduct.title} 
                      style={{ 
                      height: '500px',      
                      objectFit: 'cover',   
                      objectPosition: 'center'
                    }}
                    />
                    <div className="card-body">
                      <h5 className="card-title fw-bold">
                        {tempProduct.title}
                        <span className="badge bg-primary ms-2">{tempProduct.category}</span>
                      </h5>
                      <p className="card-text">{tempProduct.content}</p>
                      <div className="d-flex">
                        <p className="text-danger"><del>NT.{tempProduct.origin_price}</del></p>
                        <h5 className="fw-bold ms-2">NT.{tempProduct.price} / {tempProduct.unit}</h5>
                      </div>
                      
                      <div className="d-flex flex-wrap">
                        {tempProduct.imagesUrl?.map((url, index) => (
                          <img key={index} src={url} className="me-2 mb-2" style={{width: '100px',
                            height: '100px', 
                            objectFit: 'cover'}} />
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <p className="text-secondary">請點擊左側按鈕查看詳細內容</p>
                )}
              </div>
            </div>
          </div>
        ):(
        <div className="container mt-5">
          <h2 className="mb-3 fw-bold">請先登入</h2>
          <form onSubmit={signin}>
            <div className="mb-3"> 
              <label htmlFor="mail" className="form-label">電子信箱</label>
              <input type="email"   className="form-control" id="mail" name="username" placeholder="name@example.com" value={formData.username} onChange={handleChange} required />
            </div>
            <div className="mb-3"> 
              <label htmlFor="password" className="form-label">密碼</label>
              <input type="password"   className="form-control" id="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary mb-3">登入</button>
            {message && <div className="alert alert-danger p-2">{message}</div>}
          </form>
        </div>
        )}

    </>
  )
}

export default App;
