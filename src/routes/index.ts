import { ContentModule } from '@/modules/content/content.module';
import { UserModule } from '@/modules/user';
import { Routes } from 'nest-router';

export const routes: Routes = [
    {
        path: '/user',
        module: UserModule,
    },
    {
        path: '/content',
        module: ContentModule,
    },
];
