export const routes = {
  home: "/",
  dashboard: "/dashboard",
  editProfile: "/dashboard/edit",
  donate: (addressOrNickname: string) => `/${addressOrNickname}`,
};
