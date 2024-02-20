import type { Metadata } from "next";
import "./globals.css";
import React from "react";
import {ClerkProvider} from "@clerk/nextjs";
// eslint-disable-next-line camelcase
import {Inter, Space_Grotesk} from 'next/font/google'

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: "--font-inter"
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ['300', '400', '500', '600', '700'],
  variable: "--font-spaceGrotesk"
});

export const metadata: Metadata = {
  title: "DevFlow",
  description: "Платформа вопросов",
  icons: {
    icon: "/assets/images/site-logo.svg"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          formButtonPrimary: "primary-gradient",
          footerActionLink: "primary-text-gradient hover:text-primary-500",
        }
      }}
    >
      <html lang="en">
        <body className={`${inter.variable} ${spaceGrotesk.variable}`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
