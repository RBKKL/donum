export const routes = {
  home: "/",
  dashboard: "/dashboard",
  editProfile: (address: string) => `/dashboard/edit/${address}`,
  donate: (addressOrNickname: string) => `/${addressOrNickname}`,
};
