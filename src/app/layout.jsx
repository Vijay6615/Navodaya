import "../styles/globals.css";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Providers from "./providers";

export const metadata = {
  title: "Navodaya Puja",
  description: "Puja booking website",
};

import ClientAnimation from "./components/ClientAnimation";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ClientAnimation />
        <Navbar />
        <main>
            <Providers>
              {children}
            </Providers>
        </main>
        <Footer />
      </body>
    </html>
  );
}
