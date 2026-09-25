import React from "react";
import { Outlet } from "react-router-dom";
import Header from "../Header";
import "./css/Layout.css";
import Footer from "../Footer";

const Layout = () => {
  return (
    <div className="app-layout">
     
      <Header />

      <main className="main-content p-0">
        <Outlet />
      </main>
       <Footer>
        <Footer />
      </Footer>
    </div>
  );
};

export default Layout;