import {
  GetProductResponse,
  GetProductsResponse,
  ProductWithCampaign,
} from "~/schemas/propstypes";
import { getJWTToken } from "~/services/session.server";
import { authenticated } from "~/utils/api";

export const getProducts = async (
  request: Request
): Promise<ProductWithCampaign[] | undefined> => {
  const jwt = await getJWTToken(request);

  const { data, statusText } = await authenticated.get<GetProductsResponse>(
    `/products?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
      params: {
        sort: ["updatedAt:desc"],
      },
    }
  );

  if (statusText === "OK") return data.data;
  return;
};

export const getProduct = async (
  id: number,
  request: Request
): Promise<ProductWithCampaign | undefined> => {
  const jwt = await getJWTToken(request);

  const { data, statusText } = await authenticated.get<GetProductResponse>(
    `/products/${id}?populate=*`
  );
  if (statusText === "OK") return data.data;

  return;
};
