import * as yup from "yup";

export const registrationSchema = yup.object({
  firstName: yup.string().required("Veuillez insérer votre nom"),
  lastName: yup.string().required("Veuillez insérer votre prénom"),
  email: yup
    .string()
    .required("Veuillez mentionner votre e-mail")
    .email("Votre e-mail est invalide"),
  username: yup.string().required("Choisissez un utilisateur"),
  gender: yup.string().required("Etes-vous un Homme ou une Femme ?"),
  password: yup.string().required("Choisissez un mot de passe"),
});

export type registrationType = yup.InferType<typeof registrationSchema>;

export const registrationInitialValues: registrationType = {
  firstName: "",
  lastName: "",
  email: "",
  username: "",
  gender: "",
  password: "",
};
