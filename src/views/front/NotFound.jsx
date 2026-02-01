import { useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/");
    }, 3000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="container vh-100 d-flex flex-column justify-content-center align-items-center">
      <div className="text-center">
        <h1 className="display-1 fw-bold text-primary">404</h1>
        <h2 className="mb-4">哎呀！找不到這個頁面</h2>
        <p className="text-muted mb-5">您尋找的頁面可能已經移除、更名，或是暫時不可用。</p>
        <p className="mt-3 text-secondary small">將在 3 秒後自動為您跳轉至首頁...</p>
      </div>
    </div>
  );
}

export default NotFound;
