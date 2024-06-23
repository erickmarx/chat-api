import { PrismaService } from '../prisma.service';

const profile1 = {
  id: '32b8da77-a3f9-4671-ab2b-3e7cca8569c7',
  name: 'profile1',
};
const profile2 = {
  id: 'e88c09cc-0559-4309-a6ed-5b5e0496d218',
  name: 'profile2',
};

export async function developmentSeed(prisma: PrismaService) {
  await prisma.$transaction([
    prisma.profile.createMany({
      data: [profile1, profile2],
      skipDuplicates: true,
    }),

    prisma.chatSettings.createMany({
      data: [{ profileId: profile1.id }, { profileId: profile2.id }],
      skipDuplicates: true,
    }),
  ]);
}
