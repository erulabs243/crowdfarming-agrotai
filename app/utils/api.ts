import axios from "axios";
import env from "~/services/environment.server";

export const authenticated = axios.create({
  baseURL: `${env.SERVER_HOST}/api`,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
