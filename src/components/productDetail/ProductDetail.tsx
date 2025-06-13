import React, {useEffect, useState} from "react";
import {useParams, useLocation, useNavigate} from "react-router-dom";
import "../productList/ProductList.css";
import "./ProductDetail.css";
import type {Product} from "../../interfaces/Product";

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
    <div className="product-list-container" id="product-detail-print">
      <div style={{display: "flex", gap: "1rem", marginBottom: "1.5rem"}}>
        <button
          onClick={() => navigate(-1)}
          className="export-btn"
          style={{
            background: "var(--primary)",
            color: "#fff",
            padding: "0.5rem 1.5rem",
          }}
        >
          ← Volver
        </button>
        <button
          onClick={() => window.print()}
          className="export-btn"
          style={{
            background: "var(--accent)",
            color: "#0e7490",
            padding: "0.5rem 1.5rem",
          }}
        >
          🖨️ Imprimir
        </button>
      </div>
      <div className="detail-expand-grid" style={{alignItems: "flex-start"}}>
        <div>
          {product.itemsImages.length > 0 && (
            <img
              src={product.itemsImages[0]}
              alt={product.productName}
              className="product-image"
              style={{
                width: "100%",
                maxWidth: "350px",
                height: "auto",
                borderRadius: "1rem",
                boxShadow: "var(--shadow)",
              }}
            />
          )}
        </div>
        <div>
          <div
            style={{
              background: "#f1f5f9",
              borderRadius: "1rem",
              padding: "1.5rem",
              marginBottom: "1.5rem",
              boxShadow: "0 2px 8px rgba(30,64,175,0.04)",
            }}
          >
            <h4
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "var(--primary-dark)",
                marginBottom: "1rem",
              }}
            >
              {product.productName}
            </h4>
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
          <div
            style={{
              background: "#f1f5f9",
              borderRadius: "1rem",
              padding: "1.25rem",
              marginBottom: "1.5rem",
            }}
          >
            <h5 style={{fontWeight: 700, marginBottom: "0.5rem"}}>
              Descripción
            </h5>
            <p style={{color: "#334155", fontSize: "1rem", lineHeight: 1.6}}>
              {product.description}
            </p>
          </div>
          {product.cuidados && (
            <div
              style={{
                background: "#f1f5f9",
                borderRadius: "1rem",
                padding: "1.25rem",
                marginBottom: "1.5rem",
              }}
            >
              <h5 style={{fontWeight: 700, marginBottom: "0.5rem"}}>
                Cuidados
              </h5>
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
            <div
              style={{
                background: "#f1f5f9",
                borderRadius: "1rem",
                padding: "1.25rem",
                marginBottom: "1.5rem",
              }}
            >
              <h5 style={{fontWeight: 700, marginBottom: "0.5rem"}}>Origen</h5>
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
            <div
              style={{
                background: "#f1f5f9",
                borderRadius: "1rem",
                padding: "1.25rem",
                flex: "1 1 220px",
              }}
            >
              <h5 style={{fontWeight: 700, marginBottom: "0.5rem"}}>Items</h5>
              <div style={{display: "flex", flexWrap: "wrap", gap: "0.5rem"}}>
                {product.items.map((item, index) => (
                  <span
                    key={index}
                    className="badge"
                    style={{background: "#dbeafe", color: "#2563eb"}}
                  >
                    {item.itemId}
                  </span>
                ))}
              </div>
            </div>
            <div
              style={{
                background: "#f1f5f9",
                borderRadius: "1rem",
                padding: "1.25rem",
                flex: "1 1 220px",
              }}
            >
              <h5 style={{fontWeight: 700, marginBottom: "0.5rem"}}>
                Imágenes
              </h5>
              <div style={{display: "flex", flexWrap: "wrap", gap: "0.5rem"}}>
                {product.itemsImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.productName} ${index + 1}`}
                    className="product-image"
                    style={{
                      width: "3.5rem",
                      height: "3.5rem",
                      objectFit: "cover",
                      borderRadius: "0.5rem",
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
