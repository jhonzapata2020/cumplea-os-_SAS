import type { Metadata } from "next";
import { Cormorant_Garamond, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-cormorant",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://cumplea-os-sas.vercel.app"),
  title: "👑 Mis XV Años — María José Villegas",
  description: "Acompáñame a celebrar mis 15 años este Sábado 3 de Octubre. Por favor confirma tu asistencia aquí 💜",
  openGraph: {
    title: "👑 Mis XV Años — María José Villegas",
    description: "Acompáñame a celebrar mis 15 años este Sábado 3 de Octubre. Confirma tu asistencia aquí 💜",
    url: "https://cumplea-os-sas.vercel.app",
    siteName: "XV Años María José",
    images: [
      {
        url: "/maria.jpg",
        width: 800,
        height: 1200,
        alt: "María José Villegas - Mis XV Años",
      },
    ],
    locale: "es_CO",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "👑 Mis XV Años — María José Villegas",
    description: "Acompáñame a celebrar mis 15 años. Confirma tu asistencia aquí 💜",
    images: ["/maria.jpg"],
  },
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${cormorant.variable} ${jakarta.variable}`}>
      <body className="antialiased font-body bg-rose-soft/30 text-plum min-h-screen">
        {children}
      </body>
    </html>
  );
}
