import {
  GetRegistrationsWithCampaign,
  RegistrationWithCampaign,
} from "~/schemas/propstypes";
import { getJWTToken, getUserId } from "~/services/session.server";
import { authenticated } from "~/utils/api";

export const getRegistrations = async (
  request: Request
): Promise<RegistrationWithCampaign[] | undefined> => {
  const jwt = await getJWTToken(request);
  const user = await getUserId(request);

  const { data, statusText } =
    await authenticated.get<GetRegistrationsWithCampaign>(`/registrations`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        populate: {
          campaign: {
            populate: ["products"],
          },
        },
        filters: {
          users_permissions_user: {
            id: {
              $eq: user,
            },
          },
        },
      },
    });

  if (statusText === "OK") return data.data;
  return;
};

export const getRegistrationsByProduct = async (
  product: number,
  request: Request
): Promise<RegistrationWithCampaign[] | undefined> => {
  const jwt = await getJWTToken(request);
  const user = await getUserId(request);

  const { data, statusText } =
    await authenticated.get<GetRegistrationsWithCampaign>(`/registrations`, {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        populate: {
          campaign: {
            populate: ["products"],
          },
        },
        filters: {
          users_permissions_user: {
            id: {
              $eq: user,
            },
          },
          campaign: {
            products: {
              id: {
                $eq: product,
              },
            },
          },
        },
      },
    });

  if (statusText === "OK") return data.data;
  return;
};
