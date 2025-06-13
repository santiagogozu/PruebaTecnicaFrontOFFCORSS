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
const ProductList: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5);
  const navigate = useNavigate();

  // Obtener datos de la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/products");
        const data = await response.json();

        const mappedProducts = data.map((product: Product) => ({
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
          items: product.items.map((item: any) => ({itemId: item.itemId})),
          itemsImages:
            product.items[0]?.images?.map((img: any) => img.imageUrl) || [],
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

  // Filtrado de productos
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

  // Paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);

  // Selección de filas
  const handleRowSelect = (productId: string) => {
    const newSelectedRows = new Set(selectedRows);
    if (newSelectedRows.has(productId)) {
      newSelectedRows.delete(productId);
    } else {
      newSelectedRows.add(productId);
    }
    setSelectedRows(newSelectedRows);
  };

  const handleSelectAll = () => {
    if (selectedRows.size === currentItems.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(currentItems.map((p) => p.productId)));
    }
  };

  // Exportar a CSV
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
      <h2 className="product-list-title">Listado de Productos OFFCORSS</h2>

      {/* Controles */}
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
          onClick={exportToCSV}
          disabled={selectedRows.size === 0}
          className="export-btn"
        >
          <Download size={18} />
          Exportar CSV ({selectedRows.size})
        </button>
      </div>

      {/* Tabla */}
      <div className="responsive-table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    selectedRows.size === currentItems.length &&
                    currentItems.length > 0
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th>Product ID</th>
              <th>Brand</th>
              <th>Product Title</th>
              <th>Items</th>
              <th>Images</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product, index) => (
              <tr key={product.productId}>
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
                    className="product-image"
                    style={{
                      width: "3rem",
                      height: "2rem",
                      objectFit: "contain",
                    }}
                  />
                </td>
                <td>
                  <div
                    title={product.productTitle}
                    style={{
                      maxWidth: 180,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.productTitle}
                  </div>
                </td>
                <td>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "0.25rem",
                    }}
                  >
                    {product.items.map((item, itemIndex) => (
                      <span
                        key={itemIndex}
                        className="badge"
                        style={{
                          background: "#dbeafe",
                          color: "#2563eb",
                        }}
                      >
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
                      className="product-image"
                    />
                  )}
                </td>
                <td>
                  <button
                    onClick={() => handleViewDetail(product)}
                    className="actions-btn"
                    title="Ver detalle"
                  >
                    <Eye size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt4 flex items-center justify-between">
          <div className="f6 gray">
            Mostrando {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, filteredProducts.length)} de{" "}
            {filteredProducts.length} productos
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="pa2 br2 ba b--light-gray disabled-o-50 disabled-not-allowed hover-bg-near-white mr1"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="pa2 br2 ba b--light-gray disabled-o-50 disabled-not-allowed hover-bg-near-white mr1"
            >
              <ChevronLeft size={16} />
            </button>
            {[...Array(Math.min(5, totalPages))].map((_, index) => {
              const pageNumber =
                Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + index;
              return (
                <button
                  key={pageNumber}
                  onClick={() => setCurrentPage(pageNumber)}
                  className={`ph3 pv2 br2 ba mr1 ${
                    pageNumber === currentPage
                      ? "bg-blue white b--blue"
                      : "b--light-gray hover-bg-near-white"
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="pa2 br2 ba b--light-gray disabled-o-50 disabled-not-allowed hover-bg-near-white mr1"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="pa2 br2 ba b--light-gray disabled-o-50 disabled-not-allowed hover-bg-near-white"
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
