import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <div className="mt-auto">
      <footer className="mx-auto mb-auto text-center text-sm font-medium text-gray-300">
        <p>Copyright Pochi Chao ⓒ {year}</p>
      </footer>
    </div>
  );
}

export default Footer;
