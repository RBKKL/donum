export const getDefaultProfile = (address: string) => ({
  address,
  nickname: null,
  description: "",
  avatarUrl: "/assets/images/default_avatar.gif",
  minShowAmount: "1000000000000000", // 0.001 ETH
});
