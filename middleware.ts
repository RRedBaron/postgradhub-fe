import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "./common/enums/routes";

const intlMiddleware = createMiddleware({
  locales: ["en", "uk"],
  defaultLocale: "en",
  localePrefix: "always",
});

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);

  // Extract locale from pathname
  const locale = pathname.split("/")[1];
  if (!["en", "uk"].includes(locale)) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  // Remove locale from pathname for route checking
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");

  const isAuthRoute =
    pathnameWithoutLocale.startsWith(ROUTES.LOGIN) ||
    pathnameWithoutLocale.startsWith(ROUTES.SIGN_UP);
  const isLoggedIn =
    request.cookies.has("access_token") || request.cookies.has("refresh_token");
  const isProtectedRoute = pathnameWithoutLocale.startsWith("/i/");

  // Redirect to login if trying to access protected route without auth
  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/${locale}${ROUTES.LOGIN}`, request.url)
    );
  }

  // Redirect to profile if trying to access auth routes while logged in
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/${locale}${ROUTES.PROFILE}`, request.url)
    );
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
