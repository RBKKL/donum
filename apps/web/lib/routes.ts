import { browserEnv } from "@env/browser";

export const routes = {
  home: "/",
  dashboard: "/dashboard",
  challenges: "/challenges",
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
  widget: (address: string) =>
    `${browserEnv.WIDGET_BASE_URL}/?address=${address}`,
};
