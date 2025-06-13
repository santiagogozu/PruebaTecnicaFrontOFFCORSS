import React, {useEffect, useState} from "react";
import {useParams, useLocation, useNavigate} from "react-router-dom";
import "../productList/ProductList.css";
import "./ProductDetail.css";

interface Product {
  productId: string;
  productName: string;
  productTitle: string;
  brand: string;
  brandId: number;
  brandImageUrl: string;
  categoryId: string;
  categories: string[];
  description: string;
  releaseDate: string;
  Color: string[];
  Género: string[];
  linea: string[];
  items: {itemId: string}[];
  itemsImages: string[];
  cuidados?: string[];
  origen?: string[];
  link: string;
}

const ProductDetail: React.FC = () => {
  const {id} = useParams<{id: string}>();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(
    (location.state && (location.state as any).product) || null
  );
  const [loading, setLoading] = useState(!product);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!product && id) {
      setLoading(true);
      fetch(`http://localhost:4000/api/products/${id}`)
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
    <div className="mw7 center pa4" id="product-detail-print">
      {" "}
      {/* max-width-7 para un poco más de espacio, center para centrar, pa4 para padding */}
      <div className="flex justify-start mb3">
        {" "}
        {/* flex para los botones, justify-start (por defecto), mb3 para margen inferior */}
        <button
          onClick={() => navigate(-1)}
          className="pv2 ph3 bg-blue white br2 hover-bg-dark-blue mr2" // padding-vertical, padding-horizontal, color de fondo, texto blanco, border-radius, hover, margen derecho
        >
          Volver
        </button>
        <button
          onClick={() => window.print()}
          className="pv2 ph3 bg-green white br2 hover-bg-dark-green" // padding-vertical, padding-horizontal, color de fondo, texto blanco, border-radius, hover
        >
          🖨️ Imprimir
        </button>
      </div>
      <div className="flex flex-column flex-row-ns mb4">
        {" "}
        {/* flex para la imagen y los detalles, flex-column por defecto, flex-row-ns (row en pantallas medianas y grandes), mb4 para margen inferior */}
        {/* Contenedor de la imagen */}
        <div className="w-100 w-50-ns pr3-ns mb3 mb0-ns">
          {" "}
          {/* width-100 por defecto, width-50-ns en pantallas medianas y grandes, padding-right-3-ns, margen inferior para móviles, sin margen inferior en desktop */}
          {product.itemsImages.length > 0 && (
            <img
              src={product.itemsImages[0]}
              alt={product.productName}
              className="db w-100 h-auto br2 shadow-1" // display-block, width-100, height-auto, border-radius, sombra
            />
          )}
        </div>
        {/* Contenedor de los detalles del producto */}
        <div className="w-100 w-50-ns pl3-ns">
          {" "}
          {/* width-100 por defecto, width-50-ns en pantallas medianas y grandes, padding-left-3-ns */}
          {/* Sección de información principal */}
          <div className="bg-light-gray pa3 br2 mb3">
            {" "}
            {/* fondo gris claro, padding, border-radius, margen inferior */}
            <h4 className="f4 fw6 mb2">{product.productName}</h4>{" "}
            {/* tamaño de fuente, peso de fuente, margen inferior */}
            <div className="flex flex-wrap">
              {" "}
              {/* flex para la información, permite que los elementos se envuelvan */}
              {/* Aquí he cambiado el enfoque del 'gap' de Tailwind a márgenes específicos de Tachyons */}
              <div className="w-100 w-50-m pr2-m mb2">
                {" "}
                {/* width-100, width-50 en medio, padding-right en medio, margin-bottom */}
                <strong className="fw6">ID:</strong> {product.productId}
              </div>
              <div className="w-100 w-50-m pl2-m mb2">
                <strong className="fw6">Marca:</strong> {product.brand}
              </div>
              <div className="w-100 mb2">
                {" "}
                {/* Ocupa todo el ancho en todas las pantallas */}
                <strong className="fw6">Título:</strong> {product.productTitle}
              </div>
              <div className="w-100 w-50-m pr2-m mb2">
                <strong className="fw6">Categorías:</strong>{" "}
                {product.categories?.join(", ")}
              </div>
              <div className="w-100 w-50-m pl2-m mb2">
                <strong className="fw6">Color:</strong>{" "}
                {product.Color?.join(", ")}
              </div>
              <div className="w-100 w-50-m pr2-m mb2">
                <strong className="fw6">Género:</strong>{" "}
                {product.Género?.join(", ")}
              </div>
              <div className="w-100 w-50-m pl2-m mb2">
                <strong className="fw6">Línea:</strong>{" "}
                {product.linea?.join(", ")}
              </div>
              <div className="w-100 mb2">
                <strong className="fw6">Fecha de Lanzamiento:</strong>{" "}
                {new Date(product.releaseDate).toLocaleDateString()}
              </div>
            </div>
          </div>
          {/* Sección de Descripción */}
          <div className="mb3">
            <div className="bg-light-gray pa3 br2">
              <h5 className="fw6 mb2">Descripción</h5>
              <p className="dark-gray measure lh-copy f6">
                {product.description}
              </p>{" "}
              {/* dark-gray, medida para legibilidad, line-height, font-size */}
            </div>
          </div>
          {/* Sección de Cuidados (condicional) */}
          {product.cuidados && (
            <div className="mb3">
              <div className="bg-light-gray pa3 br2">
                <h5 className="fw6 mb2">Cuidados</h5>
                <ul className="list pl3 f6 lh-copy">
                  {" "}
                  {/* lista sin bullets por defecto, padding-left para indentación, font-size, line-height */}
                  {product.cuidados.map((cuidado, index) => (
                    <li key={index} className="mb1">
                      {cuidado}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {/* Sección de Origen (condicional) */}
          {product.origen && (
            <div className="mb3">
              <div className="bg-light-gray pa3 br2">
                <h5 className="fw6 mb2">Origen</h5>
                <ul className="list pl3 f6 lh-copy">
                  {product.origen.map((orig, index) => (
                    <li key={index} className="mb1">
                      {orig}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
          {/* Sección de Items e Imágenes (grid simulado con flex) */}
          <div className="flex flex-column flex-row-m mb3">
            {" "}
            {/* flex, column por defecto, row en mediano, margen inferior */}
            <div className="bg-light-gray pa3 br2 w-100 w-50-m mb3 mb0-m mr3-m">
              {" "}
              {/* fondo, padding, border-radius, width-100, width-50 en medio, margen inferior móvil, sin margen inferior en medio, margen derecho en medio */}
              <h5 className="fw6 mb2">Items</h5>
              <div className="flex flex-wrap">
                {product.items.map((item, index) => (
                  <span
                    key={index}
                    className="dib pv1 ph2 br1 f7 bg-blue-100 blue mr1 mb1" // display-inline-block, pv, ph, br, f7, color de fondo, color de texto, margen derecho e inferior
                  >
                    {item.itemId}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-light-gray pa3 br2 w-100 w-50-m">
              {" "}
              {/* fondo, padding, border-radius, width-100, width-50 en medio */}
              <h5 className="fw6 mb2">Imágenes</h5>
              <div className="flex flex-wrap">
                {product.itemsImages.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`${product.productName} ${index + 1}`}
                    className="h3 w3 mr1 mb1 ba b--light-gray br2 object-cover" // altura, ancho, margen derecho e inferior, border, color de borde, border-radius, object-fit
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
