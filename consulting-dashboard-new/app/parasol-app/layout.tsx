import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'パラソル開発ガイド',
  description: 'パラソル開発ガイドのMDベースビューア',
};

export default function ParasolAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
