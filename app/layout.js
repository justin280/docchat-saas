import './globals.css';

export const metadata = {
  metadataBase: new URL('https://docchat-saas.vercel.app'),
  title: {
    default: 'DocChat AI — Chat With Any Document Instantly',
    template: '%s'
  },
  description: 'Upload PDFs, DOCX, Excel, CSV, Markdown and 10+ formats. Ask questions, get instant AI answers powered by NVIDIA NIM. Try free — no credit card needed.',
  keywords: ['chat with PDF', 'document AI', 'AI document analysis', 'PDF chatbot', 'DOCX analysis', 'DocChat AI', 'NVIDIA NIM', 'document summarizer'],
  authors: [{ name: 'DocChat AI', url: 'https://docchat-saas.vercel.app' }],
  creator: 'DocChat AI',
  publisher: 'DocChat AI',
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, 'max-video-preview': -1, 'max-image-preview': 'large', 'max-snippet': -1 }
  },
  icons: {
    icon: [
      { url: '/favicon.png', type: 'image/png', sizes: '32x32' }
    ],
    apple: [
      { url: '/favicon.png', type: 'image/png', sizes: '180x180' }
    ]
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://docchat-saas.vercel.app',
    siteName: 'DocChat AI',
    title: 'DocChat AI — Chat With Any Document Instantly',
    description: 'Upload PDFs, DOCX, Excel, CSV, Markdown and 10+ formats. Ask questions, get instant AI answers powered by NVIDIA NIM.',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'DocChat AI — Chat With Any Document Instantly'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocChat AI — Chat With Any Document Instantly',
    description: 'Upload PDFs, DOCX, Excel, and 10+ formats. Get instant AI answers powered by NVIDIA NIM.',
    images: ['/og-image.png'],
    creator: '@DocChatAI'
  },
  alternates: {
    canonical: 'https://docchat-saas.vercel.app'
  }
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "DocChat AI",
      "url": "https://docchat-saas.vercel.app",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "description": "AI-powered document analysis tool — chat with PDFs, DOCX, Excel and 10+ formats instantly.",
      "offers": [
        {"@type":"Offer","name":"Starter","price":"0","priceCurrency":"USD","description":"15 documents/month, 100 questions/month"},
        {"@type":"Offer","name":"Pro","price":"19","priceCurrency":"USD","billingIncrement":"month"},
        {"@type":"Offer","name":"Business","price":"49","priceCurrency":"USD","billingIncrement":"month"}
      ]
    },
    {
      "@type": "WebSite",
      "url": "https://docchat-saas.vercel.app",
      "name": "DocChat AI",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://docchat-saas.vercel.app/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "Organization",
      "name": "DocChat AI",
      "url": "https://docchat-saas.vercel.app",
      "logo": "https://docchat-saas.vercel.app/logo.png",
      "sameAs": [
        "https://twitter.com/DocChatAI",
        "https://linkedin.com/company/docchat-ai"
      ]
    }
  ]
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What file formats does DocChat AI support?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "DocChat AI supports PDF, DOCX, XLSX, CSV, TXT, Markdown, HTML, RTF, EPUB, and more — up to 5 documents simultaneously."
      }
    },
    {
      "@type": "Question",
      "name": "How many documents can I upload at once?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Free plan allows up to 5 documents per session. Pro and Business plans allow unlimited document uploads."
      }
    },
    {
      "@type": "Question",
      "name": "What AI models power DocChat AI?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "DocChat AI is powered by NVIDIA NIM and supports Llama 3.1 70B, Llama 3.3 70B, Mistral Large, DeepSeek R1, DeepSeek V3, Gemma 3 27B, Phi-4, and more — 11 models total."
      }
    },
    {
      "@type": "Question",
      "name": "Is there a free plan?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Yes — DocChat AI offers a free Starter plan with 15 documents and 100 questions per month. No credit card required."
      }
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.png" type="image/png" sizes="32x32" />
        <link rel="apple-touch-icon" href="/favicon.png" />
        <link rel="canonical" href="https://docchat-saas.vercel.app" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
        {/* Google Analytics — replace GA_MEASUREMENT_ID with your ID */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script> */}
        {/* Facebook Pixel — replace PIXEL_ID with your ID */}
        {/* <script dangerouslySetInnerHTML={{ __html: `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','PIXEL_ID');fbq('track','PageView');` }} /> */}
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
