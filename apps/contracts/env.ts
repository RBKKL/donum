export const env = {
  PRIVATE_KEY: process.env.PRIVATE_KEY ?? "",
  INFURA_ID: process.env.NEXT_PUBLIC_INFURA_ID ?? "",
  REPORT_GAS: !!process.env.REPORT_GAS,
} as const;
