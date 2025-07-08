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
        justifyContent: "flex-end",
        padding: "1rem",
        gap: "0.5rem",
        fontWeight: "bold",
        fontSize: "1rem",
        userSelect: "none",
      }}
    >
      <span>ENI-LEM-IN</span>
    </footer>
  );
};

export default Footer;
