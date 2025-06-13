import React from "react";
import ProductList from "../components/productList/ProductList";

const Dashboard: React.FC = () => {
  return (
    <div className="text-center mt-4 vw-100">
      <ProductList />
    </div>
  );
};

export default Dashboard;
