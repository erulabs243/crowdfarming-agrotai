import {
  CareerType,
  GetCareerResponse,
  GetCareersResponse,
} from "~/schemas/propstypes";
import { getJWTToken } from "~/services/session.server";
import { getMeFromRequest } from "~/services/user.server";
import { authenticated } from "~/utils/api";

export const getCareers = async (
  request: Request
): Promise<CareerType[] | undefined> => {
  const jwt = await getJWTToken(request);

  const { data, statusText } = await authenticated.get<GetCareersResponse>(
    `/careers?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  if (statusText === "OK") return data.data;
  return;
};

export const getCareer = async (
  id: number,
  request: Request
): Promise<CareerType | undefined> => {
  const jwt = await getJWTToken(request);

  const { data, statusText } = await authenticated.get<GetCareerResponse>(
    `/careers/${id}?populate=*`,
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  if (statusText === "OK") return data.data;
  return;
};

export const createCareerRequest = async (
  career: number,
  phone: string,
  message: string,
  request: Request
) => {
  const jwt = await getJWTToken(request);
  const me = await getMeFromRequest(request);

  if (!me) return;

  const { data, statusText } = await authenticated.post(
    `/career-requests`,
    {
      data: {
        fullName: me.fullName,
        email: me.email,
        phone: phone,
        message: message,
        career: career,
        gender: me.gender,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  if (statusText === "OK") return data.data;
  return;
};
