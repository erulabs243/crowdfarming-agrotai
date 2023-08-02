import {
  Alert,
  AlertDescription,
  AlertIcon,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Heading,
  Input,
  Stack,
  useToast,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { LoaderArgs, LoaderFunction, json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import axios from "axios";
import { useState } from "react";
import { useRemixForm } from "remix-hook-form";
import { getCampaign } from "~/models/campaign.server";
import { getRegistrationOnCampaign } from "~/models/registration.server";
import { joinInitialValues, joinSchema, joinType } from "~/schemas/forms/join";
import { ICampaignDetail } from "~/schemas/propstypes";
import env from "~/services/environment.server";
import { getJWTToken, getUserId } from "~/services/session.server";
import { authenticated } from "~/utils/api";
import { aggregateRegistrations } from "~/utils/functions";

const resolver = yupResolver(joinSchema);

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderArgs) => {
  const id = Number(params?.id);
  const userId = await getUserId(request);
  const jwt = await getJWTToken(request);

  if (!id) return redirect("/campaigns");
  const campaign = await getCampaign(id, request);
  const hasRegistrationOnCampaign = await getRegistrationOnCampaign(
    id,
    request
  );

  return json({
    campaign: campaign,
    id: id,
    userId: userId,
    jwt: jwt,
    host: env.SERVER_HOST,
    hasRegistered: hasRegistrationOnCampaign,
  });
};

export default function CampaignJoin({ request }) {
  const data = useLoaderData();
  const { id, userId, jwt, host, hasRegistered } = data;
  const campaign = data.campaign as ICampaignDetail;
  const toast = useToast();

  const registrationsSum = aggregateRegistrations({
    type: "sum",
    values: campaign.attributes.registrations.data,
  });

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useRemixForm<joinType>({
    mode: "onSubmit",
    resolver: resolver,
    defaultValues: joinInitialValues,
    submitHandlers: {
      onValid: async (data) => {
        setIsSubmitting(true);
        try {
          //Check if has total participation
          if (registrationsSum >= campaign.attributes.amount) {
            setFormError("Le montant d'investissement est déjà atteint...");
            return false;
          }

          if (hasRegistered) {
            setFormError("Vous ne pouvez pas participer plusieurs fois...");
            return false;
          }

          const fD = {
            amount: data?.amount,
            users_permissions_user: Number(userId),
            campaign: id,
          };

          const formData = new FormData();
          formData.append("files.contrat", data.contrat[0]);
          formData.append("files.slip", data.slip[0]);
          formData.append("data", JSON.stringify(fD));
          const { data: registration, statusText } = await authenticated.post(
            `${host}/api/registrations`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${jwt}`,
              },
            }
          );

          if (statusText === "OK") {
            reset();
            toast({
              position: "top-right",
              status: "success",
              variant: "subtle",
              title: "Votre demande de participation a été bien envoyée...",
            });
            console.info("Enregistrement accompli");
            setIsSubmitting(false);
          } else {
            console.error("Oups");
            toast({
              position: "top-right",
              status: "error",
              variant: "subtle",
              title: "Veuillez réessayer plus tard. Une erreur est survenue...",
            });
            setIsSubmitting(false);
          }

          return {};
        } catch (err) {
          if (axios.isAxiosError(err)) {
            console.error(err.status);
            console.error(err.response);
          } else {
            console.error(err);
          }
          setIsSubmitting(false);
        }
      },
    },
  });

  return (
    <Box
      w={{ base: "full", lg: "4xl" }}
      mx={{ base: 4, lg: "auto" }}
      my={{ base: 8, lg: 20 }}>
      <Stack
        direction="column"
        mb={8}>
        <Heading size="xl">{campaign.attributes.campaign}</Heading>
        <Heading
          size="md"
          fontWeight={400}>
          Rejoindre la campagne
        </Heading>
      </Stack>

      <Box mx="auto">
        {formError && (
          <Alert
            status="error"
            rounded="lg"
            my={4}>
            <AlertIcon />
            <AlertDescription>{formError}</AlertDescription>
          </Alert>
        )}

        <Form
          method="post"
          onSubmit={handleSubmit}
          encType="multipart/form-data">
          <Stack
            direction="column"
            gap={4}>
            <FormControl
              isRequired
              isInvalid={"amount" in errors}>
              <FormLabel htmlFor="amount">Montant de participation</FormLabel>
              <Input
                type="number"
                {...register("amount")}
              />
              <FormErrorMessage>{errors.amount?.message}</FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={"contrat" in errors}>
              <FormLabel htmlFor="contrat">
                Télécharger le contrat signé
              </FormLabel>
              <Input
                as="input"
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                {...register("contrat")}
              />
              <FormHelperText>
                Veuillez joindre le contrat signé, en format .pdf ou .docx
              </FormHelperText>
              <FormErrorMessage>{errors.contrat?.message}</FormErrorMessage>
            </FormControl>
            <FormControl
              isRequired
              isInvalid={"slip" in errors}>
              <FormLabel htmlFor="slip">
                Télécharger le bordereau de la banque
              </FormLabel>
              <Input
                as="input"
                type="file"
                accept="image/png,image/jpeg,application/pdf"
                {...register("slip")}
              />
              <FormHelperText>
                Veuillez joindre une copie du bordereau de la banque
              </FormHelperText>
              <FormErrorMessage>{errors.slip?.message}</FormErrorMessage>
            </FormControl>
            <Button
              alignSelf="flex-start"
              type="submit"
              colorScheme="green"
              isLoading={isSubmitting}>
              Participer à la campagne
            </Button>
          </Stack>
        </Form>
      </Box>
    </Box>
  );
}
