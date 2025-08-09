import { PrismaClient } from '@prisma/client';
import prismaLogger from './prismaLogger.js';

const prisma = new PrismaClient({
    log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' }
    ]
});

prisma.$on('query', (e) => prismaLogger.query(e));
prisma.$on('error', (e) => prismaLogger.error(e));

export default prisma;
