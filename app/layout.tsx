import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Navbar from "./components/Navbar";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AGMS - Art Gallery Management System",
    description: "Modern Art Gallery Management System",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
        <body className={`${inter.className} bg-[#0b0f17] text-slate-100 min-h-screen flex flex-col`}>
        <Navbar />
        <div className="flex-1 bg-[#0b0f17]">{children}</div>
        </body>
        </html>
    );
}