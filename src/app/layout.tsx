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
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://mis-xv-maria.vercel.app"),
  title: "Mis XV años - María",
  description: "Estás cordialmente invitado a celebrar los XV años de María. Sábado 3 de octubre en Cholas.",
  openGraph: {
    title: "Mis XV años - María",
    description: "Te invito a celebrar mis XV años. Confirma tu asistencia.",
    url: "https://mis-xv-maria.vercel.app",
    siteName: "Mis XV años - María",
    locale: "es_ES",
    type: "website",
    images: [
      {
        url: "/maria.jpg",
        width: 800,
        height: 1000,
        alt: "Fotografía de María - XV Años",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mis XV años - María",
    description: "Te invito a celebrar mis XV años. Confirma tu asistencia.",
    images: ["/maria.jpg"],
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
