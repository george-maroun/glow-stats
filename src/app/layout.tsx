import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from './components/Navbar'
import Head from 'next/head';

export const metadata: Metadata = {
  title: 'Glow Stats',
  description: 'A website that aggregates stats on Glow',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className=''>
        <link rel="icon" href="/sun-icon.png" type="image/png" />
        <Navbar>
          {children}
        </Navbar>
      </body>
    </html>
  )
}
