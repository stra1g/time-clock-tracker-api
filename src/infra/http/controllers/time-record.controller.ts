import { Body, Controller, Post, Res } from '@nestjs/common';

import { StoreTimeRecordService } from '@/app/services/store-time-record.service';
import {
  StoreTimeRecordDTO,
  toStoreTimeRecordResponseDTO,
} from '@/infra/http/dtos/time-record/store-time-record.dto';
import { Response } from 'express';

@Controller('batidas')
export class TimeRecordController {
  constructor(
    private readonly storeTimeRecordService: StoreTimeRecordService,
  ) {}

  @Post()
  async create(
    @Body() { momento: timestamp }: StoreTimeRecordDTO,
    @Res() res: Response,
  ) {
    console.log('timestamp', timestamp);
    const payload = await this.storeTimeRecordService.run({
      timestamp,
    });

    return res.json(toStoreTimeRecordResponseDTO(payload)).status(201);
  }
}
