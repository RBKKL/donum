export const clientEnv = {
  INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID ?? "",
  WIDGET_BASE_URL: process.env.NEXT_PUBLIC_WIDGET_BASE_URL ?? "",
} as const;
