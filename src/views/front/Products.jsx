import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const env = import.meta.env;
const { VITE_API_BASE, VITE_API_PATH } = env;

function Products() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/products`);
        setProducts(res.data.products);
        console.log(res.data.products);
      } catch (error) {
        console.log(error);
      }
    };
    getProducts();
  }, []);

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
    <>
      <div className="container mt-3">
        <div className="row g-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="col-md-3 col-sm-6"
            >
              <div className="card h-100  product-card">
                <div style={{ height: "200px", overflow: "hidden" }}>
                  <img
                    src={product.imageUrl}
                    className="card-img-top w-100 h-100"
                    alt={product.title}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title fs-6 fw-bold text-dark mb-3">{product.title}</h5>
                  <div className="mt-auto">
                    <p className="card-text text-danger fw-bold mb-3">NT$ {product.price}</p>
                    <div className="d-grid gap-2">
                      <Link
                        to={`/product/${product.id}`}
                        className="btn btn-primary btn-sm"
                      >
                        查看詳情
                      </Link>
                      <button
                        onClick={() => addCart(product.id, 1)}
                        className="btn btn-outline-primary btn-sm"
                      >
                        加入購物車
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      ;
    </>
  );
}

export default Products;
