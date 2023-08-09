import * as yup from "yup";

export const tourSchema = yup.object({
  requestedDate: yup.date().required("Veuillez spécifier la date voulue"),
  message: yup.string().required("Un peu plus de détails sur votre visite"),
  subject: yup.string().required("Un petit mot sur votre visite"),
});

export type tourType = yup.InferType<typeof tourSchema>;

export const initialValues: tourType = {
  requestedDate: new Date(),
  message: "",
  subject: "",
};
