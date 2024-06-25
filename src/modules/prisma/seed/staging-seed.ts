import { PrismaService } from '../prisma.service';

const profiles = [
  {
    id: '32b8da77-a3f9-4671-ab2b-3e7cca8569c7',
    name: 'profile1',
  },
  {
    id: 'e88c09cc-0559-4309-a6ed-5b5e0496d218',
    name: 'profile2',
  },
];

const conversation = {
  id: 'cf931e3a-b59f-49d1-b0f7-081b02e6e62d',
};

const historys = [
  { id: '53876884-601f-4a16-b314-ba56672a5c11' },
  { id: 'a2a78503-d9ce-416a-a179-70b91114c7ea' },
];

const messages = [
  {
    id: '2045f0eb-13b8-4edc-88a9-a73e7c01694',
    content: 'Content 1',
    fromId: profiles[0].id,
  },
  {
    id: 'ffeda032-e1c9-4299-9e36-71138cb6017f',
    content: 'Content 2',
    fromId: profiles[0].id,
  },
  {
    id: '3a04b582-5231-4058-abb5-0ce19e835281',
    content: 'Content 3',
    fromId: profiles[1].id,
  },
  {
    id: '7c3e6aed-84e1-4966-8490-f93fe7bd5323',
    content: 'Content 4',
    fromId: profiles[1].id,
  },
];

export async function stagingSeed(prisma: PrismaService) {
  await prisma.$transaction([
    prisma.profile.createMany({
      data: [profiles[0], profiles[1]],
      skipDuplicates: true,
    }),
    prisma.chatSettings.createMany({
      data: [{ profileId: profiles[0].id }, { profileId: profiles[1].id }],
      skipDuplicates: true,
    }),
    prisma.conversation.create({ data: { id: conversation.id } }),
    prisma.history.createMany({
      data: [{ id: historys[0].id }, { id: historys[1].id }],
    }),
    prisma.conversationOnProfile.createMany({
      data: [
        {
          profileId: profiles[0].id,
          conversationId: conversation.id,
          historyId: historys[0].id,
        },
        {
          profileId: profiles[1].id,
          conversationId: conversation.id,
          historyId: historys[1].id,
        },
      ],
      skipDuplicates: true,
    }),
    prisma.message.createMany({ data: messages }),
    prisma.messageHistory.createMany({
      data: [
        {
          messageId: messages[0].id,
          historyId: historys[0].id,
          receivedAt: new Date(),
          viewedAt: new Date(),
        },
        {
          messageId: messages[1].id,
          historyId: historys[0].id,
          receivedAt: new Date(),
          viewedAt: new Date(),
        },
        {
          messageId: messages[2].id,
          historyId: historys[1].id,
          receivedAt: new Date(),
          viewedAt: new Date(),
        },
        {
          messageId: messages[3].id,
          historyId: historys[1].id,
          receivedAt: new Date(),
        },
      ],
    }),
  ]);
}
