import { IsString, IsISO8601 } from 'class-validator';

export class StoreTimeRecordDTO {
  @IsString()
  @IsISO8601({ strict: true })
  momento: string;
}

export class StoreTimeRecordResponseDTO {
  dia: string;
  pontos: string[];
}

export function toStoreTimeRecordResponseDTO({
  day,
  records,
}: {
  day: string;
  records: string[];
}): StoreTimeRecordResponseDTO {
  return {
    dia: day,
    pontos: records,
  };
}
