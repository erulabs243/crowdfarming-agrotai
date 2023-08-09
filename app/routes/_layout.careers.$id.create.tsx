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
  Heading,
  Icon,
  Image,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ActionArgs,
  ActionFunction,
  LoaderArgs,
  LoaderFunction,
  json,
  redirect,
} from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
  useNavigation,
} from "@remix-run/react";
import { IconArrowLeft } from "@tabler/icons-react";
import ChakraUIRenderer from "chakra-ui-markdown-renderer";
import ReactMarkdown from "react-markdown";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { FormHeading, Loader } from "~/components";
import { createCareerRequest, getCareer } from "~/models/career.server";
import { careerRequestSchema, careerRequestType } from "~/schemas/forms/career";
import { CareerType } from "~/schemas/propstypes";
import env from "~/services/environment.server";
import { initialValues } from "../schemas/forms/career";

const resolver = yupResolver(careerRequestSchema);

export const action: ActionFunction = async ({
  params,
  request,
}: ActionArgs) => {
  const id = Number(params?.id);

  if (!id) return redirect("/careers");

  const { errors, data } = await getValidatedFormData<careerRequestType>(
    request,
    resolver
  );

  if (errors) return json({ formError: true, errors: errors });

  //Create career request
  const newRequest = await createCareerRequest(
    id,
    data.phone,
    data.message,
    request
  );

  if (newRequest) return json({ formSuccess: true });

  return json({
    formError: true,
  });
};

export const loader: LoaderFunction = async ({
  params,
  request,
}: LoaderArgs) => {
  const host = env.SERVER_HOST;
  const id = Number(params?.id);

  if (!id) return redirect("/careers");
  const career = await getCareer(id, request);

  return json({ host, career });
};

/* TODO reset form after validation */

export default function CareersCreate() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRemixForm({
    mode: "onSubmit",
    resolver: resolver,
    defaultValues: initialValues,
  });

  const { state } = useNavigation();
  const navigate = useNavigate();

  const loaderData = useLoaderData();
  const actionData = useActionData();

  const career = loaderData.career as CareerType;

  const newTheme = {
    h1: (props) => {
      const { children } = props;
      return (
        <Text
          mb={2}
          fontSize="2xl"
          fontWeight="bold">
          {children}
        </Text>
      );
    },
    h2: (props) => {
      const { children } = props;
      return (
        <Text
          mb={2}
          fontSize="lg"
          fontWeight="bold">
          {children}
        </Text>
      );
    },
    img: (props) => {
      const { src, alt } = props;
      return (
        <Image
          src={src}
          alt={alt}
          rounded="lg"
          w={{ base: "90vw", lg: "4xl" }}
          h={{ base: 64, lg: 96 }}
          mr={{ base: 8, lg: "auto" }}
          my={8}
        />
      );
    },
  };

  return (
    <Box>
      {state === "loading" ? (
        <Loader />
      ) : (
        <Box
          w="full"
          pr={{ base: 12, lg: 0 }}>
          <Box
            my={{ base: 8, lg: 20 }}
            w={{ base: "full", lg: "4xl" }}
            mx={{ base: 6, lg: "auto" }}>
            <Stack direction="column">
              <Button
                variant="ghost"
                onClick={() => navigate("/careers")}
                alignSelf="flex-start"
                leftIcon={<Icon as={IconArrowLeft} />}>
                Toutes nos offres
              </Button>
              <Heading size="xl">{career.attributes.career}</Heading>
            </Stack>
            <Stack
              direction="column"
              gap={8}
              mt={{ base: 8, lg: 12 }}>
              <Image
                src={`${loaderData.host}${career.attributes.cover.data.attributes.url}`}
                rounded="lg"
                h={{ base: 64, lg: 96 }}
                w="full"
                objectFit="cover"
                objectPosition="center"
              />
              <Stack direction="column">
                <Text
                  fontSize="2xl"
                  fontWeight="bold">
                  Description
                </Text>
                <Text
                  fontSize="lg"
                  color="gray.700">
                  {career.attributes.description}
                </Text>
              </Stack>
              <Stack direction="column">
                <Text
                  fontSize="2xl"
                  fontWeight="bold">
                  Détails
                </Text>
                <ReactMarkdown
                  components={ChakraUIRenderer(newTheme)}
                  skipHtml>
                  {career.attributes.requirements}
                </ReactMarkdown>
              </Stack>
            </Stack>

            {/* Request form */}
            <Stack
              direction="column"
              py={8}
              px={{ base: 8, lg: 20 }}
              rounded="lg"
              bg="gray.100"
              my={8}
              shadow="lg">
              <FormHeading
                heading="Postuler"
                subheading="Remplissez le formulaire pour postuler"
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
                    Merci de nous avoir laissé votre candidature. Nous
                    reviendrons vers vous le plus vite possible.
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
                <FormControl
                  my={4}
                  isInvalid={"phone" in errors}
                  isRequired>
                  <FormLabel
                    fontSize="sm"
                    color="gray.700"
                    htmlFor="phone">
                    Numero de téléphone
                  </FormLabel>
                  <Input
                    type="tel"
                    {...register("phone")}
                  />
                  <FormHelperText>
                    Numéro de la forme{" "}
                    <Text
                      as="span"
                      fontWeight={700}>
                      +243xxxxxxxxx
                    </Text>
                  </FormHelperText>
                </FormControl>
                <FormControl
                  my={4}
                  isInvalid={"message" in errors}
                  isRequired>
                  <FormLabel
                    fontSize="sm"
                    color="gray.700"
                    htmlFor="message">
                    Message
                  </FormLabel>
                  <Textarea {...register("message")} />
                  <FormHelperText>
                    Une petite note à propos de vous et de vos motivations
                  </FormHelperText>
                  <FormErrorMessage>{errors.message?.message}</FormErrorMessage>
                </FormControl>
                <Button
                  alignSelf="flex-start"
                  colorScheme="green"
                  my={2}
                  type="submit"
                  isLoading={state === "submitting"}>
                  Postuler
                </Button>
              </Form>
            </Stack>
          </Box>
        </Box>
      )}
    </Box>
  );
}
