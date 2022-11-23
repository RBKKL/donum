export const routes = {
  home: "/",
  dashboard: "/dashboard",
  settings: "/dashboard/settings",
  donate: (addressOrNickname: string) => `/${addressOrNickname}`,
};
