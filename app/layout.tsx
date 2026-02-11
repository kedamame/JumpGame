import "./globals.css";
import { AppProviders } from "@/providers/AppProviders";

export const metadata = {
  title: "Tower Jump ? Farcaster Mini App",
  description: "A 2.5D voxel-style endless tower jump game."
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
