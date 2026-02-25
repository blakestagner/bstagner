import { Montserrat, Teko } from 'next/font/google'
import './globals.scss'

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
})

const teko = Teko({
  weight: ['500'],
  subsets: ['latin'],
  variable: '--font-teko',
  display: 'swap',
})

export const metadata = {
  title: 'Blake Stagner - Portfolio',
  description: 'Blake Stagner\'s portfolio website showcasing web development projects and personal apps',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${montserrat.variable} ${teko.variable}`}>
      <body>{children}</body>
    </html>
  )
}
