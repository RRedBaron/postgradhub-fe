import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("common");

  return (
    <div className="flex flex-col items-center justify-center h-full p-4">
      <div className="max-w-2xl w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-medium mb-2">{t("welcome")}</h1>
          <p className="text-lg text-default-500">{t("description")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12">
          <div className="p-6 rounded-lg border border-default-200 hover:border-default-300 transition-colors">
            <h2 className="text-xl font-medium mb-2">{t("feature1.title")}</h2>
            <p className="text-default-500">{t("feature1.description")}</p>
          </div>

          <div className="p-6 rounded-lg border border-default-200 hover:border-default-300 transition-colors">
            <h2 className="text-xl font-medium mb-2">{t("feature2.title")}</h2>
            <p className="text-default-500">{t("feature2.description")}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
