import {
  Alert,
  AlertIcon,
  Box,
  Button,
  Center,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Image,
  Input,
  Link,
  Stack,
  Text,
} from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ActionArgs,
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
import { getValidatedFormData, useRemixForm } from "remix-hook-form";
import { FormHeading } from "~/components";
import {
  loginInitialValues,
  loginSchema,
  loginType,
} from "~/schemas/forms/login";
import env from "~/services/environment.server";
import {
  createUserSession,
  getUserId,
  verifyLogin,
} from "~/services/session.server";

const resolver = yupResolver<loginType>(loginSchema);

export const loader: LoaderFunction = async ({ request }: LoaderArgs) => {
  const userId = await getUserId(request);
  const host = env.SERVER_HOST;
  if (userId) return redirect("/dashboard");
  return json({ host: host });
};

export const action = async ({ request }: ActionArgs) => {
  const { errors, data } = await getValidatedFormData<loginType>(
    request,
    resolver
  );

  if (errors) {
    return json({ error: true });
  }

  try {
    const loginUser = await verifyLogin(data.identifier, data.password);
    if (loginUser.statusText === "OK") {
      return createUserSession({
        request,
        user: loginUser.data.user.id,
        jwt: loginUser.data.jwt,
      });
    }

    return json({ error: true });
  } catch (err) {
    return json({ error: true });
  }
};

export default function Login() {
  const navigate = useNavigate();
  const { state } = useNavigation();

  const data = useLoaderData();
  const actionData = useActionData();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useRemixForm<loginType>({
    mode: "onSubmit",
    defaultValues: loginInitialValues,
    resolver: resolver,
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
            src={`${data.host}/uploads/logo_comp2_f29790d4d6.png`}
            w={48}
          />
        </Center>
        <Box
          w="50%"
          px={{ base: 4, lg: 12 }}
          rounded="lg"
          bg="gray.100">
          <FormHeading
            heading="Connexion"
            subheading="Accedez à plus d'opportunites"
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
                  Adresse e-mail/mot de passe incorrect(s)
                </Alert>
              )}
              <FormControl
                my={2}
                isRequired
                isInvalid={"identifier" in errors}>
                <FormLabel
                  fontSize="sm"
                  color="gray.700">
                  E-mail
                </FormLabel>
                <Input
                  type="text"
                  {...register("identifier")}
                />
                <FormErrorMessage>
                  {errors.identifier?.message}
                </FormErrorMessage>
              </FormControl>
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
              <Link
                href="#"
                textAlign="right"
                color="green.500"
                fontSize="sm">
                Mot de passe oublié ?
              </Link>
              <Stack
                direction="row"
                alignItems="center"
                justifyContent="space-between">
                <Button
                  type="submit"
                  isLoading={state === "submitting"}
                  colorScheme="green">
                  Se connecter
                </Button>
                <Text>ou</Text>
                <Button
                  my={4}
                  variant="outline"
                  colorScheme="gray"
                  onClick={() => navigate("/register")}>
                  Créer un compte
                </Button>
              </Stack>
            </Stack>
          </Form>
        </Box>
      </Stack>
    </Center>
  );
}
