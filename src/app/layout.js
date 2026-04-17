import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// ✅ SEO aur Social Media Preview ke liye metadata
export const metadata = {
  title: "Abhayapuri Care Hospital | Best Healthcare in Bongaigaon",
  description: "Abhayapuri Care Hospital offers 24/7 Emergency care, Cardiology, Maternity, and expert medical consultations in Ward No. 4, Abhayapuri, Bongaigaon.",
  keywords: "Hospital in Abhayapuri, Best Hospital Bongaigaon, Abhayapuri Care, Doctors in Bongaigaon",
  
  // WhatsApp/Facebook sharing ke liye
  openGraph: {
    title: "Abhayapuri Care Hospital - Your Health, Our Priority",
    description: "World-class diagnostic facilities and expert medical consultations in Abhayapuri.",
    url: "https://abhayapuricare.vercel.app", 
    siteName: "Abhayapuri Care",
    images: [
      {
        url: "/ot-bg.jpg", 
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}