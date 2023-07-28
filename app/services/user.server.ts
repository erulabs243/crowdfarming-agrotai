import { redirect } from "@remix-run/node";
import axios from "axios";
import { GetMeResponse } from "~/models/user.model";
import { registrationType } from "~/schemas/forms/register";
import env from "./environment.server";
import { getJWTToken, getUserId, logout } from "./session.server";

export const getMe = async (jwt: string) => {
  try {
    const { data, status } = await axios.get<GetMeResponse>(
      `${env.SERVER_HOST}/api/users/me?populate=*`,
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${jwt}`,
        },
      }
    );

    if (status === 200) return data;

    return null;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const getUser = async (request: Request) => {
  const jwt = await getJWTToken(request);
  if (!jwt) return null;

  const user = await getMe(jwt);
  if (user) return user;

  throw await logout(request);
};

export const requireUserId = async (
  request: Request
): Promise<number | undefined> => {
  const userId = await getUserId(request);
  if (!userId) {
    throw redirect("/login");
  }

  return userId;
};

export const registerUser = async (user: registrationType) => {
  const res = await axios.post(
    "http://localhost:1337/api/auth/local/register",
    {
      fullName: user.firstName + " " + user.lastName,
      username: user.username,
      email: user.email,
      gender: user.gender,
      password: user.password,
    }
  );

  return res;
};
