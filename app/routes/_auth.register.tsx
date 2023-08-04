import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Image,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import { ActionArgs, LoaderArgs, json, redirect } from "@remix-run/node";
import {
  Form,
  useActionData,
  useLoaderData,
  useNavigate,
} from "@remix-run/react";
import { IconBrandGoogle } from "@tabler/icons-react";
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { FormHeading } from "~/components";
import {
  registrationInitialValues,
  registrationSchema,
  registrationType,
} from "~/schemas/forms/register";
import env from "~/services/environment.server";
import { createUserSession, getUserId } from "~/services/session.server";
import { registerUser } from "~/services/user.server";

const resolver = yupResolver<registrationType>(registrationSchema);

export const loader = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  const host = env.SERVER_HOST;

  if (userId) return redirect("/dashboard");
  return json({ host });
};

//TODO display error messages

export const action = async ({ request }: ActionArgs) => {
  const { data, errors } = await getValidatedFormData(request, resolver);

  if (errors) {
    return json({ error: true });
  }

  try {
    const registrationResponse = await registerUser(data as registrationType);
    if (registrationResponse.statusText === "OK") {
      return createUserSession({
        request: request,
        user: registrationResponse.data.user.id,
        jwt: registrationResponse.data.jwt,
      });
    }

    return json({ error: true });
  } catch (err) {
    console.error(err);
    return json({ error: true });
  }
};

export default function Register() {
  const navigate = useNavigate();
  const data = useLoaderData();
  const actionData = useActionData();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useRemixForm({
    defaultValues: registrationInitialValues,
    resolver: yupResolver(registrationSchema),
    mode: "onSubmit",
  });

  return (
    <Center
      flex={1}
      minH="100vh">
      <Stack
        as={Box}
        direction="row"
        w={{ base: "full", lg: "5xl" }}
        mx="auto"
        p={8}
        alignSelf="center"
        rounded="lg"
        bg="gray.50">
        <Center flex={1}>
          <Image
            src={`${data.host}/uploads/logo_comp2_16b5b55f81.png`}
            w={48}
          />
        </Center>
        <Box
          w="50%"
          px={{ base: 4, lg: 12 }}
          rounded="lg"
          bg="gray.100">
          <FormHeading
            heading="Inscription"
            subheading="Vous n'êtes toujours pas membre ? Créez un compte !"
          />

          <Form
            method="post"
            onSubmit={handleSubmit}>
            <Stack direction="column">
              {actionData && actionData.error && (
                <Alert
                  my={2}
                  status="error">
                  <AlertIcon />
                  Une erreur lors de votre enregistrement. Veuillez réessayer...
                </Alert>
              )}
              <Stack
                direction="row"
                gap={4}>
                <FormControl
                  my={2}
                  isRequired
                  isInvalid={"firstName" in errors}>
                  <FormLabel
                    fontSize="sm"
                    color="gray.700">
                    Nom
                  </FormLabel>
                  <Input
                    type="text"
                    {...register("firstName")}
                  />
                  <FormErrorMessage>
                    {errors.firstName?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  my={2}
                  isRequired
                  isInvalid={"lastName" in errors}>
                  <FormLabel
                    fontSize="sm"
                    color="gray.700">
                    Prénom
                  </FormLabel>
                  <Input
                    type="text"
                    {...register("lastName")}
                  />
                  <FormErrorMessage>
                    {errors.lastName?.message}
                  </FormErrorMessage>
                </FormControl>
              </Stack>
              <FormControl
                my={2}
                isRequired
                isInvalid={"email" in errors}>
                <FormLabel
                  fontSize="sm"
                  color="gray.700">
                  Adresse e-mail
                </FormLabel>
                <Input
                  type="email"
                  {...register("email")}
                />
                <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
              </FormControl>
              <Stack
                direction="row"
                gap={4}>
                <FormControl
                  flex={2}
                  my={2}
                  isRequired
                  isInvalid={"username" in errors}>
                  <FormLabel
                    fontSize="sm"
                    color="gray.700">
                    Utilisateur
                  </FormLabel>
                  <Input
                    type="text"
                    {...register("username")}
                  />
                  <FormErrorMessage>
                    {errors.username?.message}
                  </FormErrorMessage>
                </FormControl>
                <FormControl
                  isInvalid={"gender" in errors}
                  flex={1}
                  my={2}
                  isRequired>
                  <FormLabel
                    fontSize="sm"
                    color="gray.700">
                    Sexe
                  </FormLabel>
                  <RadioGroup onChange={(val) => setValue("gender", val)}>
                    <Stack
                      direction="column"
                      gap={0}>
                      <Radio value="man">
                        <Text
                          fontSize="sm"
                          color="gray.700">
                          Homme
                        </Text>
                      </Radio>
                      <Radio value="woman">
                        <Text
                          fontSize="sm"
                          color="gray.700">
                          Femme
                        </Text>
                      </Radio>
                    </Stack>
                  </RadioGroup>
                </FormControl>
              </Stack>
              <FormControl
                my={2}
                isRequired
                isInvalid={"password" in errors}>
                <FormLabel
                  fontSize="sm"
                  color="gray.700">
                  Mot de passe
                </FormLabel>
                <Input
                  type="password"
                  {...register("password")}
                />
                <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
              </FormControl>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between">
                <Button
                  type="submit"
                  colorScheme="green">
                  Créer un compte
                </Button>
                <Text>ou</Text>
                <Button
                  variant="outline"
                  colorScheme="gray"
                  onClick={() => navigate("/login")}>
                  Se connecter
                </Button>
              </Stack>
            </Stack>

            <Stack
              as={Box}
              direction="column"
              my={8}>
              <Text
                textAlign="center"
                fontSize="sm">
                Utiliser une autre méthode
              </Text>
              <Button
                variant="outline"
                colorScheme="facebook"
                leftIcon={<Icon as={IconBrandGoogle} />}>
                Se connecter avec Google
              </Button>
            </Stack>
          </Form>
        </Box>
      </Stack>
    </Center>
  );
}
