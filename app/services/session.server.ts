import { createCookieSessionStorage, redirect } from "@remix-run/node";
import axios from "axios";
import env from "./environment.server";

const USER_SESSION_KEY = "userId";
const JWT_SESSION_KEY = "jwt";

/**
 * Create session storage
 */
const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__agrotai_session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [env.SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

/**
 * Get session
 * @param request
 * @returns
 */
const getSession = async (request: Request) => {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
};

/**
 * Logout
 * @param request
 * @returns
 */
export const logout = async (request: Request) => {
  const session = await getSession(request);
  return redirect("/", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
};

/**
 *
 * @param request Request
 * @param user number
 * @param jwt string
 * @returns
 */
export const createUserSession = async ({
  request,
  user,
  jwt,
}: {
  request: Request;
  user: number;
  jwt: string;
}) => {
  const session = await getSession(request);
  session.set(USER_SESSION_KEY, user);
  session.set(JWT_SESSION_KEY, jwt);
  return redirect("/dashboard", {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7,
      }),
    },
  });
};

/**
 *
 * @param identifier string
 * @param password string
 * @returns
 */
export const verifyLogin = async (identifier: string, password: string) => {
  const loginResult = await axios.post(
    `${env.SERVER_HOST}/api/auth/local`,
    {
      identifier: identifier,
      password: password,
    },
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }
  );

  return loginResult;
};

export const getUserId = async (request: Request): Promise<undefined> => {
  const session = await getSession(request);
  const userId = session.get(USER_SESSION_KEY);
  return userId;
};

export const getJWTToken = async (
  request: Request
): Promise<string | undefined> => {
  const session = await getSession(request);
  const jwt = session.get(JWT_SESSION_KEY);
  return jwt;
};
