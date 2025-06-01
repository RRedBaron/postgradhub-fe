"use client";

import { useTranslations } from "next-intl";
import { Button } from "@heroui/button";
import { useEffect } from "react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("common");

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h2 className="text-2xl font-bold mb-4">{t("error.title")}</h2>
      <p className="text-default-500 mb-4">{t("error.description")}</p>
      <Button onPress={() => reset()} color="primary" variant="flat">
        {t("error.tryAgain")}
      </Button>
    </div>
  );
}
