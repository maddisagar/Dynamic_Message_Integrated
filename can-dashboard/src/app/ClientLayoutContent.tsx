"use client";

import Footer from "../../components/Footer";

function ClientLayoutContent({ children }: { children: React.ReactNode }) {
  return (
    <>
      <main style={{ flexGrow: 1 }}>{children}</main>
      <Footer />
    </>
  );
}

export default ClientLayoutContent;
