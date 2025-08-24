import { Geist, Geist_Mono } from "next/font/google";
import { Providers } from "@/src/providers/Providers";
import { LoginModal } from "@/src/components/auth/LoginModal";
import { SignUpModal } from "@/src/components/auth/SignUpModal";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Recipe Forum",
  description: "Forum per condividere ricette deliziose",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Providers>
          {children}
          <LoginModal />
          <SignUpModal />
        </Providers>
      </body>
    </html>
  );
}
