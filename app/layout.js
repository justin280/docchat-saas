import './globals.css';

export const metadata = {
  title: 'DocChat AI — Chat with Your Documents',
  description: 'Upload any document and ask questions using NVIDIA-powered AI',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}