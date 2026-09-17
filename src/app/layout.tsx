import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Bartek Tedys - Software Developer & Geospatial ML',
  description: 'Portfolio of Bartlomiej Tedys, a software developer based in Ireland working across full-stack web development, applied AI and geospatial machine learning, including a live tree canopy detection model.',
  keywords: ['software developer', 'full-stack development', 'AI', 'prompt engineering', 'tree canopy segmentation', 'instance segmentation', 'YOLOv11', 'geospatial ML', 'remote sensing'],
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
