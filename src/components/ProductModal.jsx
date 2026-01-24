import axios from "axios";
import { useEffect, useState } from "react";

const API_BASE = "https://ec-course-api.hexschool.io/v2";
const API_PATH = "yihan";

function ProductModal({ modalData, closeModal, getProducts, modalInstance }) {
  const [tempData, setTempData] = useState(modalData);
  useEffect(() => {
    setTempData(modalData);
  }, [modalData]);

  // Modal內的輸入改值函式
  const handleModalInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    // 檢查是否為多圖欄位
    if (name.startsWith("imagesUrl_")) {
      const index = parseInt(name.split("_")[1]); // 取得它是第幾張圖
      const newImagesUrl = [...tempData.imagesUrl]; // 拷貝陣列
      newImagesUrl[index] = value; // 修改索引的值
      setTempData({
        ...tempData,
        imagesUrl: newImagesUrl,
      });
    } else {
      // 一般欄位的處理
      setTempData({
        ...tempData,
        [name]: type === "checkbox" ? (checked ? 1 : 0) : type === "number" ? Number(value) : value,
      });
    }
  };

  // 新增圖片欄位
  const addImage = () => {
    const newImagesUrl = [...tempData.imagesUrl];
    newImagesUrl.push(""); // 增加一個空字串
    setTempData({
      ...tempData,
      imagesUrl: newImagesUrl,
    });
  };

  // 移除最後一張圖
  const removeImage = () => {
    const newImagesUrl = [...tempData.imagesUrl];
    newImagesUrl.pop(); // 移除最後一項
    setTempData({
      ...tempData,
      imagesUrl: newImagesUrl,
    });
  };

  //上傳檔案
  const UploadImg = async (e) => {
    const file = e.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file-to-upload", file);
      const res = await axios.post(`${API_BASE}/api/${API_PATH}/admin/upload`, formData);
      setTempData((pre) => ({
        ...pre,
        imageUrl: res.data.imageUrl,
      }));
    } catch (error) {
      console.log(error);
    }
  };

  //更新啟動函式
  const saveProduct = async () => {
    const isEdit = !!tempData.id;
    //API 參數
    const method = isEdit ? "put" : "post";
    const url = isEdit
      ? `${API_BASE}/api/${API_PATH}/admin/product/${tempData.id}`
      : `${API_BASE}/api/${API_PATH}/admin/product`;

    const cleanedData = {
      ...tempData,
      imagesUrl: tempData.imagesUrl.filter((url) => url.trim() !== ""),
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

  return (
    <div
      id="productModal"
      className="modal fade"
      tabIndex="-1"
    >
      <div className="modal-dialog modal-xl">
        <div className="modal-content">
          <div className={`modal-header ${tempData.id ? "bg-primary text-white" : "bg-info text-black"}`}>
            <h5 className="modal-title ">{tempData.id ? "編輯產品" : "新增產品"}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeModal}
            ></button>
          </div>
          <div className="modal-body">
            <div className="row">
              <div className="col-4">
                <div className="mb-3">
                  <label
                    htmlFor="fileUpload"
                    className="form-label"
                  >
                    上傳檔案
                  </label>
                  <input
                    name="fileUpload"
                    id="fileUpload"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    className="form-control"
                    onChange={(e) => {
                      UploadImg(e);
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">主圖網址</label>
                  <input
                    name="imageUrl"
                    value={tempData.imageUrl || ""}
                    onChange={handleModalInputChange}
                    type="text"
                    className="form-control"
                  />
                  {tempData.imageUrl && (
                    <img
                      className="mt-3"
                      src={tempData.imageUrl}
                      alt={tempData.title}
                      style={{
                        width: "100px",
                        height: "100px",
                        objectFit: "cover",
                      }}
                    />
                  )}
                </div>
                {tempData.imagesUrl.map((url, index) => (
                  <div
                    className="mb-3"
                    key={index}
                  >
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
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </div>
                ))}
                {/* 動態按鈕控制 */}
                <div className="d-flex justify-content-between">
                  {/* 限制最多 5 張，且最後一個欄位有填寫內容才允許新增下一個 */}
                  {tempData.imagesUrl.length < 5 &&
                    (tempData.imagesUrl.length === 0 || tempData.imagesUrl[tempData.imagesUrl.length - 1]) && (
                      <button
                        className="btn btn-outline-primary btn-sm w-100 me-2"
                        onClick={addImage}
                      >
                        新增圖片
                      </button>
                    )}

                  {/* 如果有欄位才顯示移除按鈕 */}
                  {tempData.imagesUrl.length > 0 && (
                    <button
                      className="btn btn-outline-danger btn-sm w-100"
                      onClick={removeImage}
                    >
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
                    value={tempData.title || ""}
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
                      value={tempData.category || ""}
                      onChange={handleModalInputChange}
                      type="text"
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3 col-6">
                    <label className="form-label">單位</label>
                    <input
                      name="unit"
                      value={tempData.unit || ""}
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
                    value={tempData.content || ""}
                    onChange={handleModalInputChange}
                    className="form-control"
                    rows="4"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">描述</label>
                  <textarea
                    name="description"
                    value={tempData.description || ""}
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
                      value={tempData.origin_price || 0}
                      onChange={handleModalInputChange}
                      type="number"
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3 col-6">
                    <label className="form-label">售價</label>
                    <input
                      name="price"
                      value={tempData.price || 0}
                      onChange={handleModalInputChange}
                      type="number"
                      className="form-control"
                    />
                  </div>
                  <div className="mb-3">
                    <label
                      htmlFor="marketing_tag"
                      className="form-label"
                    >
                      行銷標籤
                    </label>
                    <select
                      name="marketing_tag"
                      id="marketing_tag"
                      value={tempData.marketing_tag || "none"}
                      onChange={handleModalInputChange}
                      className="form-select"
                    >
                      <option value="無">無標籤</option>
                      <option value="季節限定">季節限定</option>
                      <option value="強力主打">強力主打</option>
                      <option value="限量供應">限量供應</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <div className="form-check">
                      <input
                        name="is_enabled"
                        checked={tempData.is_enabled === 1}
                        onChange={handleModalInputChange}
                        className="form-check-input"
                        type="checkbox"
                        id="is_enabled_check"
                      />
                      <label
                        className="form-check-label"
                        htmlFor="is_enabled_check"
                      >
                        是否啟用
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={closeModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={saveProduct}
            >
              {tempData.id ? "確認更新" : "確認新增"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductModal;
