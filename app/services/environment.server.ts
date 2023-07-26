import { cleanEnv, str, url } from "envalid";

const env = cleanEnv(process.env, {
  SESSION_SECRET: str({ default: "R0vEgy6EGlIV42ttsaO51IeyhxL4xK2J" }),
  SERVER_HOST: url({ default: "http://localhost:1337" }),
  NODE_ENV: str({
    choices: ["development", "test", "production"],
    default: "development",
  }),
});

export default env;
