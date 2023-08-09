import {
  Registration,
  RegistrationWithCampaign,
  UserCampaign,
} from "~/schemas/propstypes";

export const aggregateRegistrations = ({
  type,
  values,
  status,
}: {
  type: "mean" | "sum";
  values: Registration[] | RegistrationWithCampaign[];
  status?: "pending" | "validated" | "rejected";
}): number => {
  if (!Array.isArray(values)) return 0;

  let sum = 0;
  for (let registration of values) {
    if (!status) sum += registration.attributes.amount;
    else
      sum =
        registration.attributes.status === status
          ? sum + registration.attributes.amount
          : sum;
  }

  switch (type) {
    case "mean":
      return sum / values.length;
    case "sum":
      return sum;
    default:
      return sum;
  }
};

export const countRegistrations = ({
  values,
  status,
}: {
  values: Registration[] | RegistrationWithCampaign[];
  status?: "pending" | "validated" | "rejected";
}): number => {
  if (!Array.isArray(values)) return 0;

  let count = 0;
  if (!status) count = values.length;
  else
    for (let registration of values) {
      count = registration.attributes.status === status ? count + 1 : count;
    }

  return count;
};

export const showPercentage = (amount: number, total: number): string => {
  if (total === 0)
    return (0).toLocaleString("fr-FR", {
      style: "percent",
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    });

  return (amount / total).toLocaleString("fr-FR", {
    style: "percent",
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
};

export const campaignInvestedIn = (
  campaign: number,
  registrations: RegistrationWithCampaign[]
): RegistrationWithCampaign | undefined => {
  const result = registrations.find((current) => {
    return current.attributes.campaign.data.id === campaign;
  });

  return result;
};

export const computeCampaignProfit = (
  investment: number,
  percent: number
): string => {
  if (percent === 0)
    return (0).toLocaleString("fr-FR", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    });

  const profit = (investment * percent) / 100;
  return profit.toLocaleString("fr-FR", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  });
};

export const getRegistrationFromCampaign = (
  campaign: UserCampaign
): Registration | undefined => {
  console.log(campaign.attributes.registrations);
  return;
};
