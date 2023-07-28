import {
  CampaignResponse,
  ICampaign,
  ICampaignDetail,
  SummaryCampaignResponse,
  UserCampaign,
  UserCampaignsResponse,
} from "~/schemas/propstypes";
import { authenticated } from "~/utils/api";
import { getJWTToken, getUserId } from "../services/session.server";

export const getCampaigns = async (
  request: Request
): Promise<ICampaign[] | undefined> => {
  const jwt = await getJWTToken(request);

  const { data, statusText } = await authenticated.get<SummaryCampaignResponse>(
    "campaigns",
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        populate: ["image", "products"],
        sort: ["updatedAt:desc"],
      },
    }
  );

  if (statusText === "OK") return data.data;
  return;
};

export const getCampaign = async (
  id: number,
  request: Request
): Promise<ICampaignDetail | undefined> => {
  const jwt = await getJWTToken(request);
  const { data, statusText } = await authenticated.get<CampaignResponse>(
    `/campaigns/${id}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        populate: ["files", "products", "categories", "image", "registrations"],
      },
    }
  );

  if (statusText === "OK") return data.data;

  return;
};

export const getCampaignsByUser = async (
  request: Request
): Promise<UserCampaign[] | undefined> => {
  const jwt = await getJWTToken(request);
  const user = await getUserId(request);

  const { data, statusText } = await authenticated.get<UserCampaignsResponse>(
    "campaigns",
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        populate: ["image", "products", "registrations"],
        sort: ["updatedAt:desc"],
        filters: {
          registrations: {
            users_permissions_user: {
              id: {
                $eq: user,
              },
            },
          },
        },
      },
    }
  );

  if (statusText === "OK") return data.data;
  return;
};

export const getCampaignByUser = async (
  id: number,
  request: Request
): Promise<ICampaignDetail | undefined> => {
  const jwt = await getJWTToken(request);
  const user = await getUserId(request);

  const { data, statusText } = await authenticated.get<CampaignResponse>(
    `/campaigns/${id}`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        populate: ["files", "products", "categories", "image", "registrations"],
        filters: {
          registrations: {
            users_permissions_user: {
              id: {
                $eq: user,
              },
            },
          },
        },
      },
    }
  );

  if (statusText === "OK") return data.data;

  return;
};
