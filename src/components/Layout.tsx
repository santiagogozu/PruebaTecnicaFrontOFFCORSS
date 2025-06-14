import React from "react";
import Navbar from "./common/Navbar";
import Footer from "./common/Footer";
import {Outlet} from "react-router-dom";

const Layout: React.FC = () => {
  return (
    <>
      <Navbar />
      <main style={{minHeight: "80vh"}}>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default Layout;
