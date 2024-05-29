import React from "react";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";
import { Outlet } from "react-router-dom";
function Routee() {
  return (
    <div>
      <Navbar />
      <div style={{ minHeight: "85vh" }}>
        <Outlet />
      </div>
      <div style={{ marginTop: "100px" }}>
        <Footer />
      </div>

    </div>
  );
}
export default Routee;
