import React from "react";

function Footer() {
    const year = new Date().getFullYear();
    return(
        <footer className="fixed bottom-0 text-center text-sm font-medium text-gray-300">
            <p>Copyright Pochi Chao ⓒ {year}</p>
        </footer>
    )
}

export default Footer;