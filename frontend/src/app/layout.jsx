import './globals.css';
import { AuthProvider } from '@/context/AuthContext';

export const metadata = {
  title: 'Mini Design Canvas - Clean 3D Editor',
  description: 'Interactive mini design canvas with Clean 3D UI, React Konva, and MongoDB persistence',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
