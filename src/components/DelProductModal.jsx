import axios from "axios";

const env = import.meta.env;
const { VITE_API_BASE, VITE_API_PATH } = env;
axios;
function DelProductModal({ closeDelModal, getProducts, tempDelProduct }) {
  //刪除功能
  const delProduct = async () => {
    try {
      await axios.delete(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product/${tempDelProduct.id}`);
      getProducts();
      closeDelModal();
    } catch (error) {
      const errorMsg = error.response?.data?.message || "刪除失敗";
      alert(errorMsg);
    }
  };

  return (
    <div
      id="delProductModal"
      className="modal fade"
      tabIndex="-1"
    >
      <div className="modal-dialog ">
        <div className="modal-content border-0">
          <div className="modal-header bg-danger text-white">
            <h5 className="modal-title">
              <span>刪除產品</span>
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={closeDelModal}
            ></button>
          </div>
          <div className="modal-body">
            是否刪除
            <strong className="text-danger"> {tempDelProduct.title} </strong>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-outline-secondary"
              onClick={closeDelModal}
            >
              取消
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={delProduct}
            >
              確認刪除
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DelProductModal;
