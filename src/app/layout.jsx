import "../styles/globals.css";
import Providers from "./providers";
import AppShell from "./components/AppShell";

export const metadata = {
  title: "Navodaya Puja",
  description: "Puja booking website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <AppShell>
            {children}
          </AppShell>
        </Providers>
      </body>
    </html>
  );
}