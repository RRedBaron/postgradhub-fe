import { NextRequest, NextResponse } from "next/server";
import createMiddleware from "next-intl/middleware";
import { ROUTES } from "./common/enums/routes";
import { routing } from "./i18n/routing";
import { Role } from "@/types/default";

const intlMiddleware = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  const { pathname } = new URL(request.url);
  const locale = pathname.split("/")[1];

  if (!["en", "uk"].includes(locale)) {
    return NextResponse.redirect(new URL(`/en${pathname}`, request.url));
  }

  const response = intlMiddleware(request);

  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}/, "");
  const isProtectedRoute = pathnameWithoutLocale.startsWith("/i/");
  const accessToken = request.cookies.get("access_token")?.value;
  const isLoggedIn = Boolean(accessToken);

  let userRole: Role | undefined;
  if (accessToken) {
    try {
      const [, payloadBase64] = accessToken.split(".");
      const decoded = JSON.parse(atob(payloadBase64));
      userRole = decoded.role as Role;
    } catch (err) {
      console.error("JWT decode error:", err);
    }
  }

  const isAuthRoute =
    pathnameWithoutLocale.startsWith(ROUTES.LOGIN) ||
    pathnameWithoutLocale.startsWith(ROUTES.REGISTER);
  const isSupervisorRoute = pathnameWithoutLocale.startsWith(ROUTES.SUPERVISOR);

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(
      new URL(`/${locale}${ROUTES.LOGIN}`, request.url)
    );
  }

  if (isSupervisorRoute && userRole !== Role.SUPERVISOR) {
    return NextResponse.redirect(
      new URL(`/${locale}${ROUTES.HOME}`, request.url)
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
