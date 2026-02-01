import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
const env = import.meta.env;
const { VITE_API_BASE, VITE_API_PATH } = env;

function SingleProduct() {
  const [product, setProduct] = useState({});
  const { id } = useParams(); // 取得網址上的 :id

  useEffect(() => {
    const getProduct = async () => {
      try {
        const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/product/${id}`);
        setProduct(res.data.product);
        console.log(res.data.product);
      } catch (error) {
        console.log("抓取單一產品失敗", error);
      }
    };
    getProduct();
  }, [id]); // 當 id 改變時重新抓取

  const addCart = async (product_id, qty = 1) => {
    const data = {
      data: {
        product_id: product_id,
        qty: qty,
      },
    };
    try {
      const res = await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`, data);
      if (res.data.success) {
        alert("成功加入購物車！");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container my-5">
      <div className="row d-flex align-items-center">
        <div className="col-md-6">
          <img
            src={product.imageUrl}
            className="img-fluid"
            alt={product.title}
          />
          <div className="d-flex flex-wrap gap-2 mt-3">
            {product.imagesUrl?.map((url, index) => (
              <img
                key={index}
                src={url}
                style={{ width: "150px", height: "150px", objectFit: "cover" }}
                className="img-thumbnail cursor-pointer"
                alt="副圖"
              />
            ))}
          </div>
        </div>
        <div className="col-md-6 px-5">
          <h2>{product.title}</h2>
          <p className="badge bg-secondary">{product.category}</p>
          <p>{product.content}</p>
          <p className="h4 text-danger">NT$ {product.price}</p>
          <button
            onClick={() => addCart(product.id, 1)}
            className="btn btn-outline-primary"
          >
            加入購物車
          </button>
        </div>
      </div>
    </div>
  );
}

export default SingleProduct;
