import './globals.css'
import { Inter } from 'next/font/google'
import Navbar from '@/components/navbar';
const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'DATA EXTRACTION',
  description: 'Generated by create next app',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} flex flex-col`}>
      <Navbar />
        {children}
      </body>
    </html>
  )
}
