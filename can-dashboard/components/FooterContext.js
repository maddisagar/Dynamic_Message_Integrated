"use client";

import React, { createContext, useState } from "react";

export const FooterContext = createContext({
  fixed: false,
  setFixed: (fixed) => {}
});

export const FooterProvider = ({ children }) => {
  const [fixed, setFixedState] = useState(false);

  const setFixed = (fixed) => {
    setFixedState(fixed);
  };

  return (
    <FooterContext.Provider value={{ fixed, setFixed }}>
      {children}
    </FooterContext.Provider>
  );
};
