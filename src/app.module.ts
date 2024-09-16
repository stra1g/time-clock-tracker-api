import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from '@/infra/db/db.module';
import { HttpModule } from '@/infra/http/http.module';

@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
