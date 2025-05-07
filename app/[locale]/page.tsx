import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("common");

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold mb-4">{t("welcome")}</h1>
      <p className="text-xl text-default-500">{t("description")}</p>
    </div>
  );
}
