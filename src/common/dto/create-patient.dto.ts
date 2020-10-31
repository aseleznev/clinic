import { ApiProperty } from '@nestjs/swagger';
import { Gender } from './gender.enum';
import { IsEnum, IsMobilePhone, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Петров Петр Петрович' })
  name: string;

  @IsNotEmpty()
  @IsNumber()
  @ApiProperty({ example: 43 })
  age: number;

  @IsNotEmpty()
  @IsEnum(Gender, { message: "gender must be a valid enum value ('Male','Female')" })
  @ApiProperty({ enum: Gender, enumName: 'Male' })
  gender: Gender;

  @IsNotEmpty()
  @IsMobilePhone('ru-RU', { strictMode: true })
  @ApiProperty({ example: '+79126312399' })
  tel: string;
}
