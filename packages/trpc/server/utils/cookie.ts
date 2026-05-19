import type { CookieOptions, Response, Request } from "express";
import { tRPCContext } from "../trpc";
import { TRPCContext } from "../context";

const ONE_MINUTE = 60 * 1000; // in milliseconds
const ONE_HOUR = 60 * ONE_MINUTE;
const ONE_DAY = 24 * ONE_HOUR;
const ONE_WEEK = 7 * ONE_DAY;
const ONE_MONTH = 30 * ONE_DAY;
const ONE_YEAR = 12 * ONE_MONTH;

const defaultCookieOption: CookieOptions = {
  path: "/",
  httpOnly: true,
  secure: false,
  sameSite: "strict",
  maxAge: ONE_YEAR,
};

export function createCookieFactory(res: Response) {
  return function createCookie(
    name: string,
    value: string,
    opts: CookieOptions = defaultCookieOption,
  ) {
    return res.cookie(name, value, opts);
  };
}

export function getCookieFactory(req: Request) {
  return function getCookie(name: string) {
    return req.cookies?.[name];
  };
}

export function clearCookieFactory(res: Response) {
  return function clearCookie(name: string) {
    return res.clearCookie(name);
  };
}

// auth cookie
const AUTH_COOKIE_NAME = "authentication-token";
export function setAuthenticationCookie(ctx: TRPCContext, accessToken: string) {
  ctx.createCookie(AUTH_COOKIE_NAME, accessToken);
}
export function getAuthenticationCookie(ctx: TRPCContext) {
  return ctx.getCookie(AUTH_COOKIE_NAME);
}
export function clearAuthenticationCookie(ctx: TRPCContext) {
  ctx.clearCookie(AUTH_COOKIE_NAME);
}
