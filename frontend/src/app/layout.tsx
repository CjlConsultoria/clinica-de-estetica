import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { AuthProvider } from '@/contexts/AuthContext';
import { StyledComponentsRegistry } from '@/components/StyledComponentsRegistry';
import LayoutWrapper from '@/components/LayoutWrapper';
import DebugPanelWrapper from '@/components/ui/DebugPanelWrapper';
import PaymentGuard from '@/components/ui/PaymentGuard';
import './globals.css';

const cabourgRegular = localFont({ src: '../fonts/CabourgOT-Regular.otf', variable: '--font-cabourg-regular', display: 'swap' });
const cabourgBold = localFont({ src: '../fonts/CabourgOT-Bold.otf', variable: '--font-cabourg-bold', display: 'swap' });
const interVariable = localFont({ src: '../fonts/InterVariable-Italic.ttf', variable: '--font-inter-variable', display: 'swap', style: 'italic' });
const interVariableRegular = localFont({ src: '../fonts/InterVariable.ttf', variable: '--font-inter-variable-regular', display: 'swap' });
const metropolisRegular = localFont({ src: '../fonts/Metropolis-Regular.otf', variable: '--font-metropolis-regular', display: 'swap' });
const metropolisSemiBold = localFont({ src: '../fonts/Metropolis-SemiBold.otf', variable: '--font-metropolis-semibold', display: 'swap' });
const robotoRegular = localFont({ src: '../fonts/Roboto-Regular.ttf', variable: '--font-roboto-regular', display: 'swap' });
const robotoMedium = localFont({ src: '../fonts/Roboto-Medium.ttf', variable: '--font-roboto-medium', display: 'swap' });

export const metadata: Metadata = {
  title: 'Clínica Estética - Sistema de Gestão',
  description: 'Sistema de gestão para clínicas de estética',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body
        className={`${cabourgRegular.variable} ${cabourgBold.variable} ${interVariable.variable} ${interVariableRegular.variable} ${metropolisRegular.variable} ${metropolisSemiBold.variable} ${robotoRegular.variable} ${robotoMedium.variable}`}
        style={{ margin: 0, padding: 0 }}
      >
        <StyledComponentsRegistry>
          <AuthProvider>
            <LayoutWrapper>
              <PaymentGuard>
                {children}
              </PaymentGuard>
            </LayoutWrapper>

            <DebugPanelWrapper />
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}