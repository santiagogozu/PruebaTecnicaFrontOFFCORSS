import React, {useEffect, useState} from "react";
import {
  Eye,
  Download,
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import "./ProductList.css";
import {useNavigate} from "react-router-dom";
import type {Product} from "../../interfaces/Product";

const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const [clickedBtn, setClickedBtn] = useState<string | null>(null);
  const [modalImg, setModalImg] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(
          import.meta.env.VITE_API_BASE_URL + "/api/products"
        );
        const data = await response.json();
        type Item = {itemId: string; images?: {imageUrl: string}[]};
        type ProductApi = Omit<Product, "items" | "itemsImages"> & {
          items: Item[];
        };

        const mappedProducts = (data as ProductApi[]).map((product) => ({
          productId: product.productId,
          productName: product.productName,
          productTitle: product.productTitle || product.productName,
          brand: product.brand,
          brandId: product.brandId,
          brandImageUrl: product.brandImageUrl,
          categoryId: product.categoryId,
          categories: product.categories || [],
          description: product.description,
          releaseDate: product.releaseDate,
          Color: product.Color || [],
          Género: product.Género || [],
          linea: product.linea || [],
          items: product.items.map((item) => ({itemId: item.itemId})),
          itemsImages:
            product.items[0]?.images?.map((img) => img.imageUrl) || [],
          cuidados: product.cuidados || [],
          origen: product.origen || [],
          link: product.link,
        }));

        setProducts(mappedProducts);
        setFilteredProducts(mappedProducts);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Error al cargar los productos");
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const filtered = products.filter(
      (product) =>
        product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.productId.includes(searchTerm) ||
        product.productTitle.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, products]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  const handleRowSelect = (productId: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(productId)) {
      newSelectedRows.delete(productId);
    } else {
      newSelectedRows.add(productId);
    }
    setSelectedRows(newSelectedRows);
  };
  const exportToCSV = () => {
    const selectedProducts = products.filter((p) =>
      selectedRows.has(p.productId)
    );
    if (selectedProducts.length === 0) {
      alert("Selecciona al menos un producto para exportar");
      return;
    }

    const headers = [
      "ProductId",
      "Brand",
      "ProductTitle",
      "Items",
      "Images",
      "Color",
      "Gender",
      "Category",
    ];
    const csvContent = [
      headers.join(","),
      ...selectedProducts.map((product) =>
        [
          product.productId,
          product.brand,
          `"${product.productTitle}"`,
          `"${product.items.map((i) => i.itemId).join("; ")}"`,
          `"${product.itemsImages.join("; ")}"`,
          `"${product.Color?.join("; ") || ""}"`,
          `"${product.Género?.join("; ") || ""}"`,
          `"${product.categories?.join("; ") || ""}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {type: "text/csv;charset=utf-8;"});
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "productos_seleccionados.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewDetail = (product: Product) => {
    navigate(`/producto/${product.productId}`, {state: {product}});
  };

  const handleAnimatedClick = (btn: string, action: () => void) => {
    setClickedBtn(btn);
    setTimeout(() => {
      setClickedBtn(null);
      action();
    }, 120);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="product-list-container">
      <h2 className="product-list-title">Listado de Productos</h2>

      <div className="product-controls">
        <div className="product-search">
          <Search />
          <input
            type="text"
            placeholder="Buscar por nombre, marca, ID o título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => handleAnimatedClick("export", exportToCSV)}
          disabled={selectedRows.size === 0}
          className={`export-btn animated-btn${
            clickedBtn === "export" ? " clicked" : ""
          }`}
        >
          <Download size={18} />
          Exportar CSV ({selectedRows.size})
        </button>
      </div>

      <div className="responsive-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>Agregar informacion a CSV</th>
              <th>Id del producto</th>
              <th>Marca</th>
              <th>Titulo de producto</th>
              <th>Items</th>
              <th>Imagen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product) => (
              <tr
                className="product-row"
                key={product.productId}
                onClick={() => handleRowSelect(product.productId)}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedRows.has(product.productId)}
                    onChange={() => handleRowSelect(product.productId)}
                  />
                </td>
                <td>
                  <span className="badge">{product.productId}</span>
                </td>
                <td>
                  <img
                    src={product.brandImageUrl}
                    alt={product.brand}
                    className="product-logo zoom-on-hover"
                    onClick={() => setModalImg(product.brandImageUrl)}
                    tabIndex={0}
                    role="button"
                    aria-label="Ver imagen grande"
                  />
                </td>
                <td style={{textAlign: "center"}}>
                  <div
                    title={product.productTitle}
                    style={{
                      maxWidth: "80%",
                      display: "inline-block",
                    }}
                  >
                    {product.productTitle}
                  </div>
                </td>
                <td>
                  <div>
                    {product.items.map((item, itemIndex) => (
                      <span key={itemIndex} className="badge items">
                        {item.itemId}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  {product.itemsImages.length > 0 && (
                    <img
                      src={product.itemsImages[0]}
                      alt={product.productName}
                      className="product-image zoom-on-hover"
                      onClick={() => setModalImg(product.itemsImages[0])}
                      tabIndex={0}
                      role="button"
                      aria-label="Ver imagen grande"
                    />
                  )}
                </td>
                <td>
                  <button
                    onClick={() =>
                      handleAnimatedClick(`view-${product.productId}`, () =>
                        handleViewDetail(product)
                      )
                    }
                    className={`actions-btn animated-btn${
                      clickedBtn === `view-${product.productId}`
                        ? " clicked"
                        : ""
                    }`}
                    title="Ver detalle"
                    style={{
                      transition:
                        "transform 0.12s cubic-bezier(.4,2,.6,1), box-shadow 0.12s",
                    }}
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
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
      {totalPages > 1 && (
        <div className="mt4 flex items-center justify-between">
          <div className="f6 gray">
            Mostrando {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, filteredProducts.length)} de{" "}
            {filteredProducts.length} productos
          </div>
          <div className="flex items-center">
            <button
              onClick={() =>
                handleAnimatedClick("first", () => setCurrentPage(1))
              }
              disabled={currentPage === 1}
              className={`pa2 br2 ba b--light-gray animated-btn${
                clickedBtn === "first" ? " clicked" : ""
              } disabled-o-50 disabled-not-allowed hover-bg-near-white mr1`}
              style={{
                transition:
                  "transform 0.12s cubic-bezier(.4,2,.6,1), box-shadow 0.12s",
              }}
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() =>
                handleAnimatedClick("prev", () =>
                  setCurrentPage(Math.max(1, currentPage - 1))
                )
              }
              disabled={currentPage === 1}
              className={`pa2 br2 ba b--light-gray animated-btn${
                clickedBtn === "prev" ? " clicked" : ""
              } disabled-o-50 disabled-not-allowed hover-bg-near-white mr1`}
              style={{
                transition:
                  "transform 0.12s cubic-bezier(.4,2,.6,1), box-shadow 0.12s",
              }}
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const pageNumber =
                Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index;
              return (
                <button
                  key={pageNumber}
                  onClick={() =>
                    handleAnimatedClick(`page-${pageNumber}`, () =>
                      setCurrentPage(pageNumber)
                    )
                  }
                  className={`ph3 pv2 br2 ba mr1 animated-btn${
                    clickedBtn === `page-${pageNumber}` ? " clicked" : ""
                  } ${
                    pageNumber === currentPage
                      ? "bg-blue white b--blue"
                      : "b--light-gray hover-bg-near-white"
                  }`}
                  style={{
                    transition:
                      "transform 0.12s cubic-bezier(.4,2,.6,1), box-shadow 0.12s",
                  }}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={() =>
                handleAnimatedClick("next", () =>
                  setCurrentPage(Math.min(totalPages, currentPage + 1))
                )
              }
              disabled={currentPage === totalPages}
              className={`pa2 br2 ba b--light-gray animated-btn${
                clickedBtn === "next" ? " clicked" : ""
              } disabled-o-50 disabled-not-allowed hover-bg-near-white mr1`}
              style={{
                transition:
                  "transform 0.12s cubic-bezier(.4,2,.6,1), box-shadow 0.12s",
              }}
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() =>
                handleAnimatedClick("last", () => setCurrentPage(totalPages))
              }
              disabled={currentPage === totalPages}
              className={`pa2 br2 ba b--light-gray animated-btn${
                clickedBtn === "last" ? " clicked" : ""
              } disabled-o-50 disabled-not-allowed hover-bg-near-white`}
              style={{
                transition:
                  "transform 0.12s cubic-bezier(.4,2,.6,1), box-shadow 0.12s",
              }}
            >
              <ChevronsRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
