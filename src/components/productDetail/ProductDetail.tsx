import React, {useEffect, useState} from "react";
import {useParams, useLocation, useNavigate} from "react-router-dom";
import type {Product} from "../../interfaces/Product";
import "./ProductDetail.css";
const ProductDetail: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const location = useLocation();
  const navigate = useNavigate();

  function getProductFromState(state: unknown): Product | null {
    if (
      state &&
      typeof state === "object" &&
      "product" in state &&
      typeof (state as {product?: unknown}).product === "object"
    ) {
      return (state as {product: Product}).product;
    }
    return null;
  }

  const [product, setProduct] = useState<Product | null>(
    getProductFromState(location.state) || null
  );
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState<string | null>(null);
  const [clickedBtn, setClickedBtn] = useState<string | null>(null);
  const [modalImg, setModalImg] = useState<string | null>(null);

  const handleBtnClick = (btn: string, action: () => void) => {
    setClickedBtn(btn);
    setTimeout(() => {
      setClickedBtn(null);
      action();
    }, 120);
  };

  useEffect(() => {
    if (!product && id) {
      setLoading(true);
      fetch(import.meta.env.VITE_API_BASE_URL + `/api/products/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setProduct(data);
          setLoading(false);
        })
        .catch(() => {
          setError("No se pudo cargar el producto");
          setLoading(false);
        });
    }
  }, [id, product]);

  if (loading) return <div className="p-8 text-center">Cargando...</div>;
  if (error || !product)
    return (
      <div className="p-8 text-center text-red-600">
        {error || "Producto no encontrado"}
      </div>
    );

  return (
    <div className="product-list-container-detail" id="product-detail-print">
      <div
        className="detail-expand-grid"
        style={{alignItems: "flex-start", marginTop: "1.5rem"}}
      >
        <div>
          <div
            style={{
              display: "flex",
              gap: "1rem",
              marginBottom: "1.5rem",
              justifyContent: "center",
            }}
          >
            <button
              onClick={() => handleBtnClick("volver", () => navigate(-1))}
              className={`export-btn animated-btn${
                clickedBtn === "volver" ? " clicked" : ""
              }`}
            >
              Volver
            </button>
            <button
              onClick={() => handleBtnClick("imprimir", () => window.print())}
              className={`export-btn animated-btn${
                clickedBtn === "imprimir" ? " clicked" : ""
              }`}
            >
              Imprimir
            </button>
          </div>
          {product.itemsImages.length > 0 && (
            <div
              style={{display: "flex", justifyContent: "center", width: "100%"}}
            >
              <img
                src={product.itemsImages[0]}
                alt={product.productName}
                className="product-image zoom-on-hover"
                style={{
                  display: "flex",
                  justifyContent: "center",
                  width: "90%",
                  maxWidth: "350px",
                  height: "auto",
                  borderRadius: "1rem",
                  boxShadow: "var(--shadow)",
                }}
                onClick={() => setModalImg(product.itemsImages[0])}
                tabIndex={0}
                role="button"
                aria-label="Ver imagen grande"
              />
            </div>
          )}
        </div>
        <div>
          <div
            style={{
              background: "#fbfbfb",
              borderRadius: "1rem",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              boxShadow: "0 2px 8px rgba(30,64,175,0.04)",
            }}
          >
            <h2
              style={{
                fontSize: "2rem",
                fontWeight: 700,
                color: "var(--primary-dark)",
                marginBottom: "1rem",
                marginTop: 0,
              }}
            >
              {product.productName}
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "0.75rem",
                marginBottom: "1rem",
              }}
            >
              <div>
                <strong>ID:</strong>{" "}
                <span className="badge">{product.productId}</span>
              </div>
              <div>
                <strong>Marca:</strong>{" "}
                <img
                  src={product.brandImageUrl}
                  alt={product.brand}
                  style={{
                    width: "3rem",
                    height: "2rem",
                    objectFit: "contain",
                    verticalAlign: "middle",
                  }}
                />
              </div>
              <div style={{gridColumn: "1 / span 2"}}>
                <strong>Título:</strong> {product.productTitle}
              </div>
              <div>
                <strong>Categorías:</strong> {product.categories?.join(", ")}
              </div>
              <div>
                <strong>Color:</strong> {product.Color?.join(", ")}
              </div>
              <div>
                <strong>Género:</strong> {product.Género?.join(", ")}
              </div>
              <div>
                <strong>Línea:</strong> {product.linea?.join(", ")}
              </div>
              <div style={{gridColumn: "1 / span 2"}}>
                <strong>Fecha de Lanzamiento:</strong>{" "}
                {new Date(product.releaseDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          <div className="detail-container">
            <h3 style={{fontWeight: 700, marginBottom: "1.5rem", marginTop: 0}}>
              Descripción
            </h3>
            <p style={{color: "#334155", fontSize: "1rem", lineHeight: 1.6}}>
              {product.description}
            </p>
          </div>
          {product.cuidados && (
            <div className="detail-container">
              <h3
                style={{fontWeight: 700, marginBottom: "1.5rem", marginTop: 0}}
              >
                Cuidados
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "1.25rem",
                  color: "#334155",
                  fontSize: "1rem",
                }}
              >
                {product.cuidados.map((cuidado, index) => (
                  <li key={index}>{cuidado}</li>
                ))}
              </ul>
            </div>
          )}
          {product.origen && (
            <div className="detail-container">
              <h3
                style={{fontWeight: 700, marginBottom: "1.5rem", marginTop: 0}}
              >
                Origen
              </h3>
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "1.25rem",
                  color: "#334155",
                  fontSize: "1rem",
                }}
              >
                {product.origen.map((orig, index) => (
                  <li key={index}>{orig}</li>
                ))}
              </ul>
            </div>
          )}
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "1.5rem",
              marginBottom: "1.5rem",
            }}
          >
            <div className="detail-container">
              <h3
                style={{fontWeight: 700, marginBottom: "1.5rem", marginTop: 0}}
              >
                Items
              </h3>
              <div style={{display: "flex", flexWrap: "wrap", gap: "0.5rem"}}>
                {product.items.map((item, index) => (
                  <span key={index} className="badge">
                    {item.itemId}
                  </span>
                ))}
              </div>
            </div>
            <div className="detail-container">
              <h3
                style={{fontWeight: 700, marginBottom: "1.5rem", marginTop: 0}}
              >
                Imágenes
              </h3>
              <div style={{display: "flex", flexWrap: "wrap", gap: "0.5rem"}}>
                {product.itemsImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.productName} ${index + 1}`}
                    className="product-image zoom-on-hover"
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      objectFit: "cover",
                      borderRadius: "0.5rem",
                    }}
                    onClick={() => setModalImg(img)}
                    tabIndex={0}
                    role="button"
                    aria-label="Ver imagen grande"
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Modal para imagen grande */}
      {modalImg && (
        <div
          className="modal-img-overlay"
          onClick={() => setModalImg(null)}
          tabIndex={-1}
        >
          <div
            className="modal-img-content"
            onClick={(e) => e.stopPropagation()}
          >
            <img src={modalImg} alt="Vista grande" />
            <button
              className="modal-img-close"
              onClick={() => setModalImg(null)}
              aria-label="Cerrar"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
