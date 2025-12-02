import "./globals.css";
import {ThemeProvider} from "@/components/theme-provider";
import Navbar from "@/components/Navbar";
import {Toaster} from "@/components/ui/sonner";
import {AppInitializer} from "@/app/init";
import Footer from "@/components/home/Footer";


export const metadata = {
  title: "Osmon",
  description: "Osmon market site",
};

export default function RootLayout({children}) {
  return (
    <html lang="en" suppressHydrationWarning>
    <body
      suppressHydrationWarning
      className={` antialiased`}
    >
      <AppInitializer/>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <Navbar/>
        {children}
        <Toaster />
        <Footer />
      </ThemeProvider>
    </body>
    </html>
  );
}
