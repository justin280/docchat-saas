import './globals.css';

export const metadata = {
  title: 'DocChat AI — Chat With Any Document Instantly',
  description: 'Upload a PDF, DOCX or TXT and ask questions in plain English. Get instant AI-powered answers from your documents. Powered by NVIDIA NIM. Free to start.',
  keywords: 'chat with PDF, ask questions about document, AI document reader, PDF chatbot, chat with PDF free, document AI, DOCX reader AI, ask PDF questions',
  authors: [{ name: 'DocChat AI' }],
  openGraph: {
    title: 'DocChat AI — Chat With Any Document Instantly',
    description: 'Upload any PDF, DOCX or TXT and ask questions in plain English. AI answers from your documents in seconds.',
    url: 'https://docchat-saas.vercel.app',
    siteName: 'DocChat AI',
    type: 'website',
    images: [
      {
        url: 'https://docchat-saas.vercel.app/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DocChat AI - Chat With Your Documents',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocChat AI — Chat With Any PDF or Document',
    description: 'Upload any document and ask questions in plain English. Powered by NVIDIA NIM AI. Free to start.',
    images: ['https://docchat-saas.vercel.app/og-image.png'],
  },
  metadataBase: new URL('https://docchat-saas.vercel.app'),
  alternates: {
    canonical: 'https://docchat-saas.vercel.app',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><circle cx='50' cy='50' r='50' fill='%2376b900'/><text y='.9em' font-size='70' x='15'>💬</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}