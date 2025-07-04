import React, { useContext } from "react";
import { FooterContext } from "./FooterContext";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#005286",
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "1rem",
        gap: "0.5rem",
        fontWeight: "bold",
        fontSize: "1rem",
        userSelect: "none",
      }}
    >
      <img src="/logo-white.svg" alt="Logo" style={{ height: "24px", marginRight: "0.75rem" }} />
      <span>ENI-LEM-IN</span>
    </footer>
  );
};

export default Footer;
