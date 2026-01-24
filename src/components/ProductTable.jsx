function ProdectTable({ products, openModal, openDelModal }) {
  return (
    <table className="table table-striped table-hover text-center align-middle">
      <thead>
        <tr>
          <th>產品名稱</th>
          <th>類別</th>
          <th>原價</th>
          <th>售價</th>
          <th>標籤</th>
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
              <td>{item.marketing_tag}</td>
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
                  onClick={() => openModal("edit", item)}
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
            <td
              colSpan="7"
              className="text-center text-secondary"
            >
              目前沒有產品資料
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}

export default ProdectTable;
