import * as yup from "yup";

export const loginSchema = yup.object({
  identifier: yup.string().required("Adresse e-mail/utilisateur obligatoire"),
  password: yup.string().required("Mot de passe obligatoire"),
  redirectTo: yup.string(),
});

export type loginType = yup.InferType<typeof loginSchema>;

export const loginInitialValues: loginType = {
  identifier: "",
  password: "",
  redirectTo: "/dashboard",
};
