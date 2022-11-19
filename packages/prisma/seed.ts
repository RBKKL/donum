import { prisma, Prisma } from ".";

async function main() {
  const user1 = await prisma.profile.upsert({
    where: { address: "0xAC0772000aa52CbF8a8dB501cC8caC03cDF01bf6" },
    update: {},
    create: {
      address: "0xAC0772000aa52CbF8a8dB501cC8caC03cDF01bf6",
      nickname: "AverageNixEnjoyer",
      description: "Da da ya",
      minShowAmount: new Prisma.Decimal(2000000000000000), // 0.002 ETH
    },
  });
  const user2 = await prisma.profile.upsert({
    where: { address: "0xA5aDE7Ae4f38C4CF674A7FC0D6C53EE12986Ed56" },
    update: {},
    create: {
      address: "0xA5aDE7Ae4f38C4CF674A7FC0D6C53EE12986Ed56",
      nickname: "OhManILovePhysics",
      description: "always learning",
      minShowAmount: new Prisma.Decimal(1500000000000000), // 0.0015 ETH
    },
  });
  const user3 = await prisma.profile.upsert({
    where: { address: "0x7c49301dAe0eCD335fe04164a98Dcfde59472AB4" },
    update: {},
    create: {
      address: "0x7c49301dAe0eCD335fe04164a98Dcfde59472AB4",
      description: "Professional Warface player",
    },
  });
  console.log({ user1, user2, user3 });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
