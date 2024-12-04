import { Injectable, OnModuleInit, OnApplicationShutdown } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnApplicationShutdown {
    async onModuleInit() {
        await this.$connect();
        console.log('Prisma connected to the database');
    }

    async onApplicationShutdown() {
        await this.$disconnect();
        console.log('Prisma disconnected from the database');
    }
}
