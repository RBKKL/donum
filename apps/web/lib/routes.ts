export const routes = {
  home: "/",
  dashboard: "/dashboard",
  alert: "/dashboard/alert",
  settings: "/dashboard/settings",
  authorization: "/auth",
  donate: (addressOrNickname: string) => `/${addressOrNickname}`,
};
