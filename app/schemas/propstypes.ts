export type NavbarLinksProps = {
  label: string;
  uri: string;
  isButton: boolean;
};

export type ImageAttributes = {
  name: string;
  width: number;
  height: number;
  url: string;
};

export interface IImage {
  id: number;
  attributes: ImageAttributes;
}

export interface ICampaign {
  id: number;
  attributes: {
    slug: string;
    campaign: string;
    isActive: boolean;
    amount: number;
    fundPercentage: number;
    updatedAt: string;
    image: {
      data: IImage;
    };
    products: {
      data: Product[];
    };
  };
}

export type ICampaignDetail = {
  attributes: {
    description: string;
    startsAt: string;
    endsAt: string;
    baseAmount: number;
    topAmount: number | null;
    fundStartsAt: string;
    fundEndsAt: string;
    files: {
      data: File[];
    };
    categories: {
      data: Category[];
    };
    registrations: {
      data: Registration[];
    };
  };
} & ICampaign;

export type UserCampaign = {
  attributes: {
    registrations: {
      data: Registration[];
    };
  };
} & ICampaign;

export type SummaryCampaignResponse = {
  data: ICampaign[];
};

export type UserCampaignsResponse = {
  data: UserCampaign[];
};

export type Registration = {
  id: number;
  attributes: {
    status: string;
    amount: number;
    updatedAt: string;
  };
};

export type RegistrationWithCampaign = {
  attributes: {
    campaign: {
      data: ICampaign;
    };
  };
} & Registration;

export type GetRegistrationsWithCampaign = {
  data: RegistrationWithCampaign[];
};

export type Category = {
  id: number;
  attributes: {
    name: string;
    slug: string;
    updatedAt: string;
  };
};

export type Product = {
  id: number;
  attributes: {
    name: string;
    slug: string;
    status: string;
    updatedAt: string;
  };
};

export type ProductWithCampaign = {
  attributes: {
    campaigns: {
      data: ICampaign[];
    };
    image: {
      data: IImage;
    };
    category: {
      data: Category;
    };
  };
} & Product;

export type GetProductsResponse = {
  data: ProductWithCampaign[];
};

export type GetProductResponse = {
  data: ProductWithCampaign;
};

export type File = {
  id: number;
  attributes: {
    name: string;
    ext: string;
    url: string;
    updatedAt: string;
  };
};

export interface IProduct {
  id: number;
  attributes: {
    name: string;
    slug: string;
    updatedAt: string;
    status: string;
  };
}

export type CampaignResponse = {
  data: ICampaignDetail;
};
