import { DM_Sans, DM_Serif_Display, Teko } from 'next/font/google'
import './globals.scss'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
  display: 'swap',
})

const dmSerifDisplay = DM_Serif_Display({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-dm-serif',
  display: 'swap',
})

const teko = Teko({
  weight: ['500', '600'],
  subsets: ['latin'],
  variable: '--font-teko',
  display: 'swap',
})

export const metadata = {
  title: 'Blake Stagner - Senior Full-Stack & AI Engineer',
  description: 'Blake Stagner — Senior Full-Stack Software Engineer specializing in AI integrations (Claude, ChatGPT, Gemini, RAG), React, Next.js, Node.js, and Flutter.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} ${dmSerifDisplay.variable} ${teko.variable}`}>
      <body>{children}</body>
    </html>
  )
}
