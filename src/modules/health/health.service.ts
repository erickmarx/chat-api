import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class HealthService {
  constructor(private prismaService: PrismaService) {}

  async health() {
    try {
      return { database: await this.prismaService.$queryRaw`SELECT 1` };
    } catch (e) {
      throw new Error('Database is not connected');
    }
  }
}
