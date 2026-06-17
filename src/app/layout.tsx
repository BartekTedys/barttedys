import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bartek Tedys — Geospatial ML & Software Development',
  description: 'Tree canopy detection from aerial imagery using instance segmentation. Portfolio of Bartlomiej Tedys — ML engineer and software developer based in Ireland, relocating to the Netherlands.',
  keywords: ['tree canopy segmentation', 'aerial imagery', 'instance segmentation', 'YOLOv11', 'geospatial ML', 'remote sensing'],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=JetBrains+Mono:wght@300;400;500&display=swap" rel="stylesheet" />
      </head>
      <body>{children}</body>
    </html>
  )
}
