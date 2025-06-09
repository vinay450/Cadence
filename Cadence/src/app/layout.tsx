import { ThemeProvider } from '@/components/ThemeProvider';
import '@/styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <head />
      <body className="min-h-screen bg-white dark:bg-gray-900">
        <ThemeProvider>
          <main className="relative">
            {children}
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
} 