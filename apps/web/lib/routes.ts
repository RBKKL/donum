export const routes = {
  home: "/",
  dashboard: "/dashboard",
  alert: "/dashboard/alert",
  settings: "/dashboard/settings",
  authorization: (callbackUrl: string | undefined = undefined) => {
    let url = "/auth";
    if (callbackUrl) {
      const params = new URLSearchParams({ callbackUrl });
      url += `?${params.toString()}`;
    }

    return url;
  },
  donate: (addressOrNickname: string) => `/${addressOrNickname}`,
};
