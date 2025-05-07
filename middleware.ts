import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "./common/enums/routes";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const locale = pathname.split("/")[1];

  // Проверяем, поддерживается ли локаль
  if (!["en", "uk"].includes(locale)) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  // Применяем next-intl middleware для обработки локализации
  let response = intlMiddleware(request);

  // Извлекаем путь без локали
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");

  // Проверяем, является ли роут защищённым
  const isProtectedRoute = pathnameWithoutLocale.startsWith("/i/");
  const isLoggedIn =
    request.cookies.has("access_token") || request.cookies.has("refresh_token");

  // Проверяем, является ли роут страницей авторизации
  const isAuthRoute =
    pathnameWithoutLocale.startsWith(ROUTES.LOGIN) ||
    pathnameWithoutLocale.startsWith(ROUTES.SIGN_UP);

  // Если это защищённый роут и пользователь не авторизован
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/${locale}${ROUTES.LOGIN}`, request.url)
    );
  }

  // Если пользователь авторизован и пытается зайти на страницу логина/регистрации
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/${locale}${ROUTES.PROFILE}`, request.url)
    );
  }

  // Возвращаем ответ от next-intl или продолжаем обработку
  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
