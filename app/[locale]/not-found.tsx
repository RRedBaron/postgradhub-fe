import Link from "next/link";
import { useTranslations } from "next-intl";

export default function NotFound() {
  const t = useTranslations("NotFound");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center px-4">
        <h1 className="text-9xl font-bold text-gray-800">404</h1>
        <h2 className="text-2xl font-semibold text-gray-600 mt-4">
          {t("title")}
        </h2>
        <p className="text-gray-500 mt-2 mb-6">{t("description")}</p>
        <Link
          href="/"
          className="inline-block bg-blue-600  px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
        >
          {t("backHome")}
        </Link>
      </div>
    </div>
  );
}
