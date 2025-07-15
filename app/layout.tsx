// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { Plus_Jakarta_Sans } from 'next/font/google';

const inter = Plus_Jakarta_Sans({ subsets: ['latin'], weight: ['200', '300', '400', '600']});

export const metadata: Metadata = {
  title: 'Ghana Infrastructure Reporter',
  description: 'Report infrastructure problems in Ghana',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
          {children}
   
      </body>
    </html>
  );
}