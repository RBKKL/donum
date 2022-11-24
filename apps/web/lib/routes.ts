export const routes = {
  home: "/",
  dashboard: "/dashboard",
  alert: "/dashboard/alert",
  settings: "/dashboard/settings",
  donate: (addressOrNickname: string) => `/${addressOrNickname}`,
};
