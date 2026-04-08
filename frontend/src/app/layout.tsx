import type { Metadata } from 'next'
import { Bebas_Neue, Syne, IBM_Plex_Mono } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const bebas = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--display' })
const syne = Syne({ subsets: ['latin'], variable: '--body' })
const plexMono = IBM_Plex_Mono({ weight: ['300', '400', '500'], subsets: ['latin'], variable: '--mono' })

export const metadata: Metadata = {
  title: 'STACKR — Intelligent Card Intelligence',
  description: 'Intelligent credit card recommendation and comparison platform.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${syne.variable} ${bebas.variable} ${plexMono.variable} font-body bg-[var(--ink)] text-[var(--text)] antialiased`}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
