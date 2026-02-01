import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
const env = import.meta.env;
const { VITE_API_BASE, VITE_API_PATH } = env;

const formatNumber = (num) => {
  return num?.toLocaleString();
};

function Cart() {
  const [cart, Setcart] = useState([]);
  const [loadingItems, setLoadingItems] = useState([]);

  const getCart = async () => {
    try {
      const res = await axios.get(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart`);
      Setcart(res.data.data.carts);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCart();
  }, []);

  const updateCartItem = async (id, product_id, qty) => {
    if (qty < 1) return;
    setLoadingItems((prev) => [...prev, id]);
    try {
      const data = {
        data: {
          product_id: product_id,
          qty: Number(qty),
        },
      };
      await axios.put(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart/${id}`, data);
      getCart();
    } catch (error) {
      console.log(error);
    } finally {
      setLoadingItems((prev) => prev.filter((item) => item !== id));
    }
  };

  const removeItem = async (id) => {
    try {
      await axios.delete(`${VITE_API_BASE}/api/${VITE_API_PATH}/cart/${id}`);
      getCart();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="container py-3">
        <table className="table align-middle">
          <thead>
            <tr>
              <th
                style={{ width: "40%" }}
                scope="col"
              >
                品名
              </th>
              <th
                className="text-center"
                style={{ width: "150px" }}
                scope="col"
              >
                數量
              </th>
              <th
                style={{ width: "120px" }}
                scope="col"
                className="text-center"
              >
                單價
              </th>
              <th
                style={{ width: "120px" }}
                scope="col"
                className="text-center"
              >
                小計
              </th>
              <th
                style={{ width: "100px" }}
                scope="col"
                className="text-center"
              >
                操作
              </th>
            </tr>
          </thead>
          <tbody>
            {cart.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="d-flex align-items-center">
                    <img
                      src={item.product.imageUrl}
                      alt={item.product.title}
                      style={{ width: "100px" }}
                      className="me-3"
                    />
                    {item.product.title}
                  </div>
                </td>
                <td>
                  <div
                    style={{ width: "120px" }}
                    className="input-group input-group-sm mx-auto"
                  >
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      disabled={loadingItems.includes(item.id) || item.qty === 1}
                      onClick={() => updateCartItem(item.id, item.product_id, item.qty - 1)}
                    >
                      -
                    </button>
                    <input
                      className="form-control text-center"
                      type="text"
                      value={item.qty}
                      readOnly
                    />
                    <button
                      className="btn btn-outline-primary"
                      type="button"
                      disabled={loadingItems.includes(item.id)}
                      onClick={() => updateCartItem(item.id, item.product_id, item.qty + 1)}
                    >
                      +
                    </button>
                  </div>
                </td>
                <td className="text-center">NT$ {item.product.price}</td>
                <td className="text-center fw-bold">NT$ {item.total}</td>
                <td className="text-center">
                  <button
                    onClick={() => removeItem(item.id)}
                    className="btn btn-outline-danger btn-sm"
                  >
                    <i className="bi bi-trash"></i> 刪除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td
                className="fw-bold"
                colSpan="3"
              >
                總計
              </td>
              <td className="text-center fw-bold text-danger">
                NT$ {formatNumber(cart.reduce((acc, item) => acc + item.total, 0))}
              </td>
              <td></td>
            </tr>
          </tfoot>
        </table>
      </div>
    </>
  );
}

export default Cart;
