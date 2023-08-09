import * as yup from "yup";

export const careerRequestSchema = yup.object({
  phone: yup.string().required("Le numero de téléphone est obligatoire"),
  message: yup.string().required("Laissez une petite note"),
});

export type careerRequestType = yup.InferType<typeof careerRequestSchema>;

export const initialValues: careerRequestType = {
  phone: "",
  message: "",
};
