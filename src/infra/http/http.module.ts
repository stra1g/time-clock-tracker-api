import { Module } from '@nestjs/common';

import { TimeRecordController } from './controllers/time-record.controller';
import { DatabaseModule } from '@/infra/db/db.module';
import { StoreTimeRecordService } from '@/app/services/store-time-record.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TimeRecordController],
  providers: [StoreTimeRecordService],
})
export class HttpModule {}
