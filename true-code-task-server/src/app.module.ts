import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthenticationModule } from './authentication';
import { FilesModule } from './files';
import { UserProfileModule } from './user-profile';
import { CommentsModule } from './comments';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [ConfigModule.forRoot(), AuthenticationModule, FilesModule, UserProfileModule, CommentsModule,ServeStaticModule.forRoot({
    rootPath: join(__dirname, 'client'),
  })],
  controllers: [],
  providers: [],
})
export class AppModule {}
