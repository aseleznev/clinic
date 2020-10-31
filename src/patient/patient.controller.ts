import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Res } from '@nestjs/common';
import { PatientDto } from '../common/dto/patient.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { StatusDto } from '../common/dto/status.dto';
import { CreatePatientDto } from '../common/dto/create-patient.dto';
import { PatientService } from './patient.service';

@ApiTags('patient')
@Controller('patient')
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  @Get()
  async findAll(): Promise<PatientDto[]> {
    return await this.patientService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id', new ParseIntPipe()) id: number, @Res() res): Promise<PatientDto> {
    const result = await this.patientService.findOne(id);
    if (result) {
      return res.status(HttpStatus.OK).send(result);
    } else {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send(new StatusDto({ success: false, message: `id:${id}, row not found` }));
    }
  }

  @Post()
  @ApiBody({ type: CreatePatientDto })
  async save(@Body() patient: CreatePatientDto, @Res() res): Promise<StatusDto> {
    if (this.patientService.hasRequiredProperties(patient)) {
      const result = await this.patientService.insert(patient);
      return this.sendResult(result, res);
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(new StatusDto({ success: false, message: `the entity does not have required properties` }));
    }
  }

  @Put(':id')
  @ApiBody({ type: CreatePatientDto })
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() patient: CreatePatientDto,
    @Res() res
  ): Promise<StatusDto> {
    if (this.patientService.hasProperties(patient)) {
      const result = await this.patientService.update(id, patient);
      return this.sendResult(result, res);
    } else {
      return res
        .status(HttpStatus.BAD_REQUEST)
        .send(new StatusDto({ success: false, message: `the entity does not have properties` }));
    }
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number, @Res() res): Promise<StatusDto> {
    const result = await this.patientService.delete(id);
    return this.sendResult(result, res);
  }

  sendResult(result: StatusDto, res): Promise<StatusDto> {
    if (!result.success) {
      return res.status(HttpStatus.BAD_REQUEST).send(result);
    }
    return res.status(HttpStatus.OK).send(result);
  }
}
