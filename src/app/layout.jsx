import "../styles/globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

export const metadata = {
  title: "Panditji Puja",
  description: "Puja booking website",
};

import ClientAnimation from "./components/ClientAnimation";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientAnimation />
        <Navbar />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
