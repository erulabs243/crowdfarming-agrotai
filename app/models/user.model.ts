export type Role = {
  id: number;
  type: string;
};

export type User = {
  id: number;
  username: string;
  email: string;
  fullName: string;
  confirmed: boolean;
  gender: string;
  role: Role;
};

export type GetMeResponse = {
  data: User;
};
