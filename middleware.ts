import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "./common/enums/routes";
import { routing } from "./i18n/routing";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const locale = pathname.split("/")[1];

  if (!["en", "uk"].includes(locale)) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  let response = intlMiddleware(request);

  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");

  const isProtectedRoute = pathnameWithoutLocale.startsWith("/i/");
  const isLoggedIn = request.cookies.has("access_token");

  const isAuthRoute =
    pathnameWithoutLocale.startsWith(ROUTES.LOGIN) ||
    pathnameWithoutLocale.startsWith(ROUTES.REGISTER);

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/${locale}${ROUTES.LOGIN}`, request.url)
    );
  }

  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/${locale}${ROUTES.PROFILE}`, request.url)
    );
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
