import { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

// RootLayout is the root layout for the app
export default function RootLayout({ children }: Props) {
  return children;
}
