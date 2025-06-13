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
  const [itemsPerPage] = useState(10);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [animatingOut, setAnimatingOut] = useState(false);

  // Obtener datos de la API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:4000/api/products");
        const data = await response.json();

        const mappedProducts = data.map((product: any) => ({
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

  // Reemplazar función handleViewDetail
  const handleViewDetail = (product: Product) => {
    if (expandedRowId === product.productId) {
      setAnimatingOut(true);
      setTimeout(() => {
        setExpandedRowId(null);
        setShowDetail(false);
        setAnimatingOut(false);
      }, 300); // Debe coincidir con la duración de la transición en CSS
    } else {
      setExpandedRowId(product.productId);
      setSelectedProduct(product);
      setShowDetail(true);
      setAnimatingOut(false);
    }
  };

  // Imprimir detalle
  const handlePrint = () => {
    window.print();
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
    <div className="max-w-7xl mx-auto p-6">
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Listado de Productos OFFCORSS
        </h2>
      </div>

      {/* Controles */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nombre, marca, ID o título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={exportToCSV}
          disabled={selectedRows.size === 0}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium ${
            selectedRows.size === 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-green-600 text-white hover:bg-green-700"
          }`}
        >
          <Download size={16} />
          Exportar CSV ({selectedRows.size})
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden flex justify-center">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 mx-auto">
            <thead className="bg-blue-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.size === currentItems.length &&
                      currentItems.length > 0
                    }
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Product ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Brand
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Product Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Images
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentItems.map((product, index) => (
                <React.Fragment key={product.productId}>
                  <tr className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedRows.has(product.productId)}
                        onChange={() => handleRowSelect(product.productId)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {product.productId}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <img
                          src={product.brandImageUrl}
                          alt={product.brand}
                          className="h-8 w-12 object-contain mr-2"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div
                        className="max-w-xs truncate"
                        title={product.productTitle}
                      >
                        {product.productTitle}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {product.items.map((item, itemIndex) => (
                          <span
                            key={itemIndex}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            {item.itemId}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.itemsImages.length > 0 && (
                        <img
                          src={product.itemsImages[0]}
                          alt={product.productName}
                          className="product-image"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleViewDetail(product)}
                        className="text-blue-600 hover:text-blue-900 hover:bg-blue-50 p-2 rounded-lg transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                  {showDetail && expandedRowId === product.productId && (
                    <tr>
                      <td colSpan={7} className="p-0">
                        <div className="detail-expand-container expanded-row-content">
                          {selectedProduct && (
                            <div className="bg-blue-600 p-4 rounded-t-lg flex justify-between items-center">
                              <h3 className="text-xl font-bold">
                                Detalle del Producto
                              </h3>
                              <button
                                onClick={() => {
                                  setShowDetail(false);
                                  setExpandedRowId(null);
                                }}
                                className="hover:text-gray-200 text-2xl"
                              >
                                ×
                              </button>
                            </div>
                          )}

                          {selectedProduct && (
                            <div className="detail-expand-grid">
                              <div>
                                {selectedProduct.itemsImages.length > 0 && (
                                  <img
                                    src={selectedProduct?.itemsImages[0]}
                                    alt={selectedProduct?.productName}
                                    className="product-image"
                                  />
                                )}
                              </div>
                              <div>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                  <h4 className="text-xl font-bold mb-4">
                                    {selectedProduct?.productName}
                                  </h4>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <strong>ID:</strong>{" "}
                                      {selectedProduct?.productId}
                                    </div>
                                    <div>
                                      <strong>Marca:</strong>{" "}
                                      {selectedProduct?.brand}
                                    </div>
                                    <div className="md:col-span-2">
                                      <strong>Título:</strong>{" "}
                                      {selectedProduct?.productTitle}
                                    </div>
                                    <div>
                                      <strong>Categorías:</strong>{" "}
                                      {selectedProduct?.categories?.join(", ")}
                                    </div>
                                    <div>
                                      <strong>Color:</strong>{" "}
                                      {selectedProduct?.Color?.join(", ")}
                                    </div>
                                    <div>
                                      <strong>Género:</strong>{" "}
                                      {selectedProduct?.Género?.join(", ")}
                                    </div>
                                    <div>
                                      <strong>Línea:</strong>{" "}
                                      {selectedProduct?.linea?.join(", ")}
                                    </div>
                                    <div className="md:col-span-2">
                                      <strong>Fecha de Lanzamiento:</strong>{" "}
                                      {new Date(
                                        selectedProduct.releaseDate
                                      ).toLocaleDateString()}
                                    </div>
                                  </div>
                                </div>

                                <div className="mb-6">
                                  <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-bold mb-2">
                                      Descripción
                                    </h5>
                                    <p className="text-gray-700">
                                      {selectedProduct?.description}
                                    </p>
                                  </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 mb-6">
                                  <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-bold mb-2">Items</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedProduct.items.map(
                                        (item, index) => (
                                          <span
                                            key={index}
                                            className="inline-flex items-center px-2 py-1 rounded text-sm font-medium bg-blue-100 text-blue-800"
                                          >
                                            {item.itemId}
                                          </span>
                                        )
                                      )}
                                    </div>
                                  </div>
                                  <div className="bg-gray-50 p-4 rounded-lg">
                                    <h5 className="font-bold mb-2">Imágenes</h5>
                                    <div className="flex flex-wrap gap-2">
                                      {selectedProduct?.itemsImages.map(
                                        (img, index) => (
                                          <img
                                            key={index}
                                            src={img}
                                            alt={`${
                                              selectedProduct.productName
                                            } ${index + 1}`}
                                            className="product-image"
                                          />
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {selectedProduct?.cuidados && (
                                  <div className="mb-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <h5 className="font-bold mb-2">
                                        Cuidados
                                      </h5>
                                      <ul className="list-disc list-inside text-sm space-y-1">
                                        {selectedProduct.cuidados.map(
                                          (cuidado, index) => (
                                            <li key={index}>{cuidado}</li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                )}

                                {selectedProduct?.origen && (
                                  <div className="mb-6">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                      <h5 className="font-bold mb-2">Origen</h5>
                                      <ul className="list-disc list-inside text-sm space-y-1">
                                        {selectedProduct.origen.map(
                                          (orig, index) => (
                                            <li key={index}>{orig}</li>
                                          )
                                        )}
                                      </ul>
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt-6 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Mostrando {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, filteredProducts.length)} de{" "}
            {filteredProducts.length} productos
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronsLeft size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
                  className={`px-3 py-2 rounded-lg border ${
                    pageNumber === currentPage
                      ? "bg-blue-600 text-white border-blue-600"
                      : "border-gray-300 hover:bg-gray-50"
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
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ChevronRight size={16} />
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
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
