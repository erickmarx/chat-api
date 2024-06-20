import { PrismaService } from '../prisma.service';
const prisma = new PrismaService();

async function main() {
  await prisma.profile.createMany({
    data: [
      { id: 'e88c09cc-0559-4309-a6ed-5b5e0496d218', name: 'profile1' },
      { id: '32b8da77-a3f9-4671-ab2b-3e7cca8569c7', name: 'profile2' },
    ],
  });
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
