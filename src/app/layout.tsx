import type { Metadata } from 'next'
import './globals.css'
import { Navbar } from './components/Navbar'

export const metadata: Metadata = {
  title: 'Glow Stats',
  description: 'A dashboard for aggregating stats on the Glow Protocol',
  icons: {
    icon: '../../public/sun-icon.png', 
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  return (
    <html lang="en">
      <body className=''>
          <Navbar>
            {children}
          </Navbar>
      </body>
    </html>
  )
}
