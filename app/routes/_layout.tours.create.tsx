import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Stack,
  Textarea,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionArgs, ActionFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { FormHeading } from "~/components";
import { createTour } from "~/models/tour.server";
import { initialValues, tourSchema, tourType } from "~/schemas/forms/tour";

const resolver = yupResolver(tourSchema);

export const action: ActionFunction = async ({ request }: ActionArgs) => {
  const { errors, data } = await getValidatedFormData<tourType>(
    request,
    resolver
  );

  if (errors) return json({ formError: true, errors: errors });

  //Store in the database
  const newTour = await createTour(
    data.subject,
    data.message,
    data.requestedDate,
    request
  );
  if (newTour) return json({ formSuccess: true });

  return json({ formError: true });
};

export default function ToursCreate() {
  const actionData = useActionData();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRemixForm({
    mode: "onSubmit",
    resolver: resolver,
    defaultValues: initialValues,
  });

  return (
    <Box>
      <Box
        w="full"
        pr={{ base: 12, lg: 0 }}>
        <Box
          my={{ base: 8, lg: 20 }}
          w={{ base: "full", lg: "4xl" }}
          mx={{ base: 6, lg: "auto" }}>
          <Stack direction="column">
            <FormHeading
              heading="Demander une visite"
              subheading="Pour voir de vous-mêmes notre manière de faire les choses"
            />

            {actionData && actionData.formSuccess && (
              <Alert
                rounded="lg"
                flexDirection="column"
                status="success"
                variant="subtle"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                py={8}
                my={4}
                borderWidth={1}
                borderColor="green.700">
                <AlertIcon
                  boxSize={8}
                  mr={0}
                />
                <AlertTitle
                  mt={4}
                  mb={1}
                  fontSize="lg">
                  Requête envoyée
                </AlertTitle>
                <AlertDescription maxW={{ base: "75vw", lg: "sm" }}>
                  Merci de nous avoir laissé votre message. Nous reviendrons
                  vers vous le plus vite possible.
                </AlertDescription>
              </Alert>
            )}

            {actionData && actionData.formError && (
              <Alert
                my={2}
                status="error">
                <AlertIcon />
                Certaines informations fournies sont incorrectes. Veuillez les
                corriger...
              </Alert>
            )}

            <Form onSubmit={handleSubmit}>
              <Stack
                direction="column"
                gap={4}>
                <FormControl
                  isRequired
                  isInvalid={"subject" in errors}>
                  <FormLabel htmlFor="subject">Objet de la visite</FormLabel>
                  <Input
                    type="text"
                    {...register("subject")}
                  />
                  <FormHelperText>
                    Un petit mot sur l'objet de votre visite
                  </FormHelperText>
                  <FormErrorMessage>{errors.subject?.message}</FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={"requestedDate" in errors}>
                  <FormLabel htmlFor="requestedDate">
                    Date de votre visite
                  </FormLabel>
                  <Input
                    type="datetime-local"
                    {...register("requestedDate")}
                  />
                  <FormHelperText>
                    Quelle est la date qui vous arrange le plus ?
                  </FormHelperText>
                  <FormErrorMessage>
                    {errors.requestedDate?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={"message" in errors}>
                  <FormLabel htmlFor="message">Petite note</FormLabel>
                  <Textarea {...register("message")} />
                  <FormHelperText>
                    Un peu plus de détails sur votre visite
                  </FormHelperText>
                  <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
                </FormControl>
                <Button
                  mt={4}
                  alignSelf="flex-start"
                  type="submit"
                  rounded="lg"
                  colorScheme="green">
                  Laisser un message
                </Button>
              </Stack>
            </Form>
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
