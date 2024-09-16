import { Module } from '@nestjs/common';

import { TimeRecordController } from './controllers/time-record.controller';
import { DatabaseModule } from '@/infra/db/db.module';
import { StoreTimeRecordService } from '@/app/services/store-time-record.service';
import { TimeSheetsController } from '@/infra/http/controllers/time-sheets.controller';
import { GenerateTimeSheetService } from '@/app/services/generate-time-sheet.service';

@Module({
  imports: [DatabaseModule],
  controllers: [TimeRecordController, TimeSheetsController],
  providers: [StoreTimeRecordService, GenerateTimeSheetService],
})
export class HttpModule {}
