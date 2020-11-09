import { NestApplicationOptions } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { useContainer } from 'class-validator';
import { Bootstrap } from './bootstrap';
import { Gkr } from './core';

Gkr.run(async () => {
    const options: NestApplicationOptions = {
        logger: ['error', 'warn'],
    };
    const app = await NestFactory.create<NestFastifyApplication>(
        Bootstrap,
        new FastifyAdapter(),
        options,
    );
    useContainer(app.select(Bootstrap), { fallbackOnErrors: true });
    return app;
});
