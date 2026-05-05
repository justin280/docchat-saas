import './globals.css';

export const metadata = {
  title: 'DocChat AI — Chat With Any Document Instantly',
  description: 'Upload PDFs, DOCX, Excel, CSV, Markdown and 10+ formats. Ask questions, get instant AI answers powered by NVIDIA NIM. Try free — no credit card needed.',
  keywords: 'chat with PDF, document AI, PDF chatbot, chat with multiple PDFs, AI Excel analyzer, contract review AI, document analysis, NVIDIA NIM',
  openGraph: {
    title: 'DocChat AI — Chat With Any Document Instantly',
    description: 'Upload PDFs, DOCX, Excel, CSV and more. Get instant AI-powered answers from your documents.',
    url: 'https://docchat-saas.vercel.app',
    siteName: 'DocChat AI',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'DocChat AI — Chat With Any Document Instantly',
    description: 'Upload PDFs, DOCX, Excel, CSV and more. Get instant AI-powered answers from your documents.',
  },
  alternates: { canonical: 'https://docchat-saas.vercel.app' },
};

const schemaOrg = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "SoftwareApplication",
      "name": "DocChat AI",
      "url": "https://docchat-saas.vercel.app",
      "description": "AI-powered document chat. Upload PDFs, DOCX, Excel and 10+ formats and ask questions instantly.",
      "applicationCategory": "BusinessApplication",
      "operatingSystem": "Web",
      "offers": [
        {"@type":"Offer","name":"Starter","price":"0","priceCurrency":"USD","description":"15 documents/month, 100 questions/month"},
        {"@type":"Offer","name":"Pro","price":"19","priceCurrency":"USD","billingIncrement":"month"},
        {"@type":"Offer","name":"Business","price":"49","priceCurrency":"USD","billingIncrement":"month"}
      ],
      "featureList": ["Chat with multiple PDFs","AI Excel analyzer","Contract review AI","Multi-document analysis","Advanced RAG","Follow-up prompts","Auto-summarize","Document comparison"]
    },
    {
      "@type": "Organization",
      "name": "DocChat AI",
      "url": "https://docchat-saas.vercel.app",
      "logo": "https://docchat-saas.vercel.app/logo.png",
      "contactPoint": {"@type":"ContactPoint","contactType":"customer support","email":"support.docchatai@proton.me"},
      "sameAs": [
        "https://www.facebook.com/share/18tcsvjgAh/",
        "https://www.instagram.com/docchatai"
      ]
    },
    {
      "@type": "LocalBusiness",
      "name": "DocChat AI",
      "url": "https://docchat-saas.vercel.app",
      "email": "support.docchatai@proton.me",
      "description": "AI-powered document analysis and chat platform"
    }
  ]
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
        />
        {/* Google Analytics — replace GA_MEASUREMENT_ID with your ID */}
        {/* <script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script> */}
        {/* Facebook Pixel — replace PIXEL_ID with your ID */}
        {/* <script dangerouslySetInnerHTML={{__html: "!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','PIXEL_ID');fbq('track','PageView');"}} /> */}
      </head>
      <body style={{margin:0,padding:0,backgroundColor:'#0a0a0a',color:'#fff',fontFamily:'system-ui,sans-serif'}}>
        {children}
      </body>
    </html>
  );
}
