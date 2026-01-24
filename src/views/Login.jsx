import { useState } from "react";
import axios from "axios";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "yihan";

function Login({ setIsAuth, getProducts, setMessage, message }) {
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
  };

  //登入-讀取+送出+取得產品資料
  const signin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API_BASE}/admin/signin`, formData);
      // 取得 token 並存入 cookie
      const { token, expired } = res.data;
      document.cookie = `hexToken=${token}; expires=${new Date(expired)};`;
      //之後需驗證的都會帶上token
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

  return (
    <div className="container mt-5">
      <h2 className="mb-3 fw-bold">請先登入</h2>
      <form onSubmit={signin}>
        <div className="mb-3">
          <label
            htmlFor="mail"
            className="form-label"
          >
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
          <label
            htmlFor="password"
            className="form-label"
          >
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
        <button
          type="submit"
          className="btn btn-primary mb-3"
        >
          登入
        </button>
        {message && <div className="alert alert-danger p-2">{message}</div>}
      </form>
    </div>
  );
}

export default Login;
