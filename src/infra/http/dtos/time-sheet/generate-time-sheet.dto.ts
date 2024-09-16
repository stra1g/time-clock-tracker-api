import {
  IsString,
  Matches,
  ValidationOptions,
  registerDecorator,
} from 'class-validator';

function IsValidYearMonth(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'isValidYearMonth',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any) {
          if (typeof value !== 'string') return false;
          const [year, month] = value.split('-').map(Number);
          return year >= 1900 && year <= 2100 && month >= 1 && month <= 12;
        },
        defaultMessage() {
          return 'anoMes must be a valid year-month in the format YYYY-MM';
        },
      },
    });
  };
}

export class GenerateTimeSheetDTO {
  @IsString()
  @Matches(/^\d{4}-\d{2}$/, { message: 'anoMes must be in the format YYYY-MM' })
  @IsValidYearMonth()
  anoMes: string;
}
