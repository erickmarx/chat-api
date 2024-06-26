import { parseArgs } from 'node:util';
import { developmentSeed } from './development-seed';
import { PrismaService } from '../prisma.service';
import { stagingSeed } from './staging-seed';

const options = {
  environment: { type: 'string' },
};

const prisma = new PrismaService();

async function main() {
  const {
    values: { environment },
  } = parseArgs({ options } as any);

  if (environment === 'development') {
    return developmentSeed(prisma);
  }

  stagingSeed(prisma);
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
