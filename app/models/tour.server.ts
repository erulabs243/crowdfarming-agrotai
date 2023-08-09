import { getJWTToken } from "~/services/session.server";
import { getMeFromRequest } from "~/services/user.server";
import { authenticated } from "~/utils/api";

export const createTour = async (
  subject: string,
  message: string,
  requestedDate: Date,
  request: Request
) => {
  const jwt = await getJWTToken(request);
  const me = await getMeFromRequest(request);

  if (!me) return;

  const newTour = await authenticated.post(
    `/tours`,
    {
      data: {
        users_permissions_user: me.id,
        subject: subject,
        message: message,
        requestedDate: requestedDate,
      },
    },
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );

  if (newTour.statusText === "OK") return newTour.data;
  return;
};
