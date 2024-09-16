import { GenerateTimeSheetService } from '@/app/services/generate-time-sheet.service';
import { GenerateTimeSheetDTO } from '@/infra/http/dtos/time-sheet/generate-time-sheet.dto';
import { Controller, Get, Param, Res } from '@nestjs/common';

import { Response } from 'express';

@Controller('folhas-de-ponto')
export class TimeSheetsController {
  constructor(
    private readonly generateTimeSheetService: GenerateTimeSheetService,
  ) {}

  @Get(':anoMes')
  async generateSheet(
    @Res() res: Response,
    @Param() params: GenerateTimeSheetDTO,
  ) {
    console.log(params.anoMes);
    const payload = await this.generateTimeSheetService.run({
      yearMonth: params.anoMes,
    });
    return res.json(payload).status(200);
  }
}
