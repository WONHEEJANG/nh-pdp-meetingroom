import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '회의실 예약',
  description: '회의실 예약 시스템',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>
        {children}
      </body>
    </html>
  )
}
