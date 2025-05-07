"use client";

import * as React from "react";
import type { ThemeProviderProps } from "next-themes";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastProvider } from "@heroui/toast";
import { LanguageProvider } from "@/lib/contexts/language-context";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

const queryClient = new QueryClient();

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();

  return (
    <QueryClientProvider client={queryClient}>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>
          <LanguageProvider>
            <ToastProvider placement="bottom-right" />
            {children}
            <ReactQueryDevtools initialIsOpen={false} />
          </LanguageProvider>
        </NextThemesProvider>
      </HeroUIProvider>
    </QueryClientProvider>
  );
}
