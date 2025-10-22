import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import ToastProvider from '@/components/ToastProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ResolveX',
  description: 'Premium complaint and issue-resolution system',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow" />
        <meta name="referrer" content="no-referrer" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          {children}
        </div>
        <ToastProvider />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Remove any Lovable branding or development indicators
              function removeLovableBranding() {
                const selectors = [
                  '[data-lovable]',
                  '[class*="lovable"]',
                  '[class*="Lovable"]',
                  '[id*="lovable"]',
                  '[id*="Lovable"]',
                  '[data-nextjs-toast]',
                  '[data-nextjs-dialog]',
                  '.__next-dev-overlay',
                  '.__next-dev-error-overlay',
                  '[style*="position: fixed"][style*="bottom"]'
                ];
                
                selectors.forEach(selector => {
                  const elements = document.querySelectorAll(selector);
                  elements.forEach(el => {
                    el.style.display = 'none';
                    el.style.visibility = 'hidden';
                    el.style.opacity = '0';
                    el.remove();
                  });
                });
              }
              
              // Run immediately and on DOM changes
              removeLovableBranding();
              if (typeof MutationObserver !== 'undefined') {
                const observer = new MutationObserver(removeLovableBranding);
                observer.observe(document.body, { childList: true, subtree: true });
              }
              
              // Run on page load
              document.addEventListener('DOMContentLoaded', removeLovableBranding);
              window.addEventListener('load', removeLovableBranding);
            `,
          }}
        />
      </body>
    </html>
  );
}



