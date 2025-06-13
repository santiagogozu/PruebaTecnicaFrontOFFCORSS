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
    <div>
      <div className="mb4">
        <h2 className="f2 tc dark-gray mb4">Listado de Productos OFFCORSS</h2>
      </div>

      {/* Controles */}
      <div className="mb4 flex flex-column flex-row-ns justify-between items-center">
        <div className="relative flex-auto mw6-ns mb3 mb0-ns">
          <Search className="absolute left-1 top-2 h1 w1 gray" />
          <input
            type="text"
            placeholder="Buscar por nombre, marca, ID o título..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-100 pl4 pr2 pv2 ba b--light-gray br2 input-reset outline-0 focus-b--blue"
          />
        </div>
        <button
          onClick={exportToCSV}
          disabled={selectedRows.size === 0}
          className={`flex items-center pv2 ph3 br2 fw5 ${
            selectedRows.size === 0
              ? "bg-gray-300 dark-gray cursor-not-allowed" // background-gray-300, dark-gray, cursor-not-allowed
              : "bg-green white hover-bg-dark-green" // background-green, white, hover-background-dark-green
          }`}
        >
          <Download size={16} className="mr2" />
          Exportar CSV ({selectedRows.size})
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white br3 shadow-2 overflow-hidden flex justify-center">
        <div className="overflow-x-auto w-100">
          <table className=" w-100">
            <thead className="bg-blue white">
              {" "}
              {/* background-blue, white */}
              <tr>
                <th className="pa3 tl f6 fw6 ttu tracked">
                  {" "}
                  {/* padding-3, text-left, font-size-6, font-weight-6, text-transform-uppercase, letter-spacing-tracked */}
                  <input
                    type="checkbox"
                    checked={
                      selectedRows.size === currentItems.length &&
                      currentItems.length > 0
                    }
                    onChange={handleSelectAll}
                    className="mr2" // margin-right-2
                  />
                </th>
                <th className="pa3 tl f6 fw6 ttu tracked">Product ID</th>
                <th className="pa3 tl f6 fw6 ttu tracked">Brand</th>
                <th className="pa3 tl f6 fw6 ttu tracked">Product Title</th>
                <th className="pa3 tl f6 fw6 ttu tracked">Items</th>
                <th className="pa3 tl f6 fw6 ttu tracked">Images</th>
                <th className="pa3 tl f6 fw6 ttu tracked">Acciones</th>
              </tr>
            </thead>
            <tbody className="lh-copy">
              {" "}
              {/* line-height-copy */}
              {currentItems.map((product, index) => (
                <tr
                  onClick={() => handleViewDetail(product)}
                  key={product.productId}
                  className={`bb b--light-gray ${
                    index % 2 === 0 ? "bg-white" : "bg-light-gray"
                  } hover-bg-washed-blue`} // border-bottom, border-light-gray, background-white/light-gray, hover-background-washed-blue
                >
                  <td className="pa3 nowrap">
                    {" "}
                    {/* padding-3, no-wrap */}
                    <input
                      type="checkbox"
                      checked={selectedRows.has(product.productId)}
                      onChange={() => handleRowSelect(product.productId)}
                      className="mr2" // margin-right-2
                    />
                  </td>
                  <td className="pa3 nowrap">
                    {" "}
                    {/* padding-3, no-wrap */}
                    <span className="dib pv1 ph2 br-pill bg-light-gray dark-gray f7 fw6">
                      {" "}
                      {/* display-inline-block, padding-vertical-1, padding-horizontal-2, border-radius-pill, background-light-gray, dark-gray, font-size-7, font-weight-6 */}
                      {product.productId}
                    </span>
                  </td>
                  <td className="pa3 nowrap">
                    <div className="flex items-center">
                      {" "}
                      {/* flex, items-center */}
                      <img
                        src={product.brandImageUrl}
                        alt={product.brand}
                        className="h2 w3 object-contain mr2" // height-2, width-3, object-contain, margin-right-2
                      />
                    </div>
                  </td>
                  <td className="pa3">
                    <div
                      className="mw5 truncate" // max-width-5, truncate
                      title={product.productTitle}
                    >
                      {product.productTitle}
                    </div>
                  </td>
                  <td className="pa3">
                    <div className="flex flex-wrap">
                      {" "}
                      {/* flex, flex-wrap */}
                      {product.items.map((item, itemIndex) => (
                        <span
                          key={itemIndex}
                          className="dib pv1 ph2 br1 f7 bg-blue-100 blue mr1 mb1" // display-inline-block, padding-vertical-1, padding-horizontal-2, border-radius-1, font-size-7, background-blue-100, blue, margin-right-1, margin-bottom-1
                        >
                          {item.itemId}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="pa3 nowrap">
                    {product.itemsImages.length > 0 && (
                      <img
                        src={product.itemsImages[0]}
                        alt={product.productName}
                        className="h3 w3 cover" // height-3, width-3, object-fit-cover
                      />
                    )}
                  </td>
                  <td className="pa3 nowrap">
                    <button
                      onClick={() => handleViewDetail(product)}
                      className="blue hover-bg-lightest-blue pa2 br2 transition-colors" // blue, hover-background-lightest-blue, padding-2, border-radius-2, transition-colors (note: transition-colors is not a direct Tachyons class, but a common practice for hover effects)
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="mt4 flex items-center justify-between">
          {" "}
          {/* margin-top-4, flex, items-center, justify-between */}
          <div className="f6 gray">
            {" "}
            {/* font-size-6, gray */}
            Mostrando {indexOfFirstItem + 1} -{" "}
            {Math.min(indexOfLastItem, filteredProducts.length)} de{" "}
            {filteredProducts.length} productos
          </div>
          <div className="flex items-center">
            {" "}
            {/* flex, items-center */}
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="pa2 br2 ba b--light-gray disabled-o-50 disabled-not-allowed hover-bg-near-white mr1" // padding-2, border-radius-2, border, border-light-gray, opacity-50 (disabled), cursor-not-allowed (disabled), hover-background-near-white, margin-right-1
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
                    // padding-horizontal-3, padding-vertical-2, border-radius-2, border, margin-right-1
                    pageNumber === currentPage
                      ? "bg-blue white b--blue" // background-blue, white, border-blue
                      : "b--light-gray hover-bg-near-white" // border-light-gray, hover-background-near-white
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
