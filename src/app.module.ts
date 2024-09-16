import { Module } from '@nestjs/common';
import { DatabaseModule } from '@/infra/db/db.module';
import { HttpModule } from '@/infra/http/http.module';

@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
