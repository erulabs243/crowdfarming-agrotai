import * as yup from "yup";

const validExts = [
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];

//TODO check file size and format
export const joinSchema = yup.object({
  amount: yup
    .number()
    .required("Le montant est obligatoire")
    .min(30, "Il faudrait au moins 30$"),
  contrat: yup.mixed<File>().required("Veuillez joindre le contrat").nullable(),
  /* .test("fileSize", `Le fichier est trop lourd`, async (value) => {
      try {
        const val = await value;
        return val && val[0].size <= 10240000;
      } catch (err) {
        return false;
      }
    })
    .test(
      "is-valid-type",
      "Le fichier doit être au format png, jpg, docx ou pdf",
      async (value) => {
        try {
          const val = await value;
          return val && validExts.includes(val[0].type);
        } catch (err) {
          return false;
        }
      }
    ) */
  slip: yup.mixed<File>().required("Le bordereau est obligatoire").nullable(),
  /* .test("fileSize", "Le fichier est trop lourd", async (value) => {
      try {
        const val = await value;
        return val && val[0].size <= 10240000;
      } catch (err) {
        return false;
      }
    })
    .test(
      "is-valid-type",
      "Le fichier doit être au format png, jpg, docx ou pdf",
      async (value) => {
        try {
          const val = await value;
          return val && validExts.includes(val[0].type);
        } catch (err) {
          return false;
        }
      }
    ) */
});

export type joinType = yup.InferType<typeof joinSchema>;

export const joinInitialValues: joinType = {
  amount: 100,
  contrat: null,
  slip: null,
};
