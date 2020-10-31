import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Put, Res } from '@nestjs/common';
import { DoctorService } from './doctor.service';
import { StatusDto } from '../common/dto/status.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { DoctorDto } from '../common/dto/doctor.dto';
import { CreateDoctorDto } from '../common/dto/create-doctor.dto';

@ApiTags('doctor')
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Get()
  async findAll(): Promise<DoctorDto[]> {
    return await this.doctorService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id', new ParseIntPipe()) id: number, @Res() res): Promise<DoctorDto> {
    const result = await this.doctorService.findOne(id);
    if (result) {
      return res.status(HttpStatus.OK).send(result);
    } else {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send(new StatusDto({ success: false, message: `id:${id}, row not found` }));
    }
  }

  @Post()
  @ApiBody({ type: CreateDoctorDto })
  async save(@Body() doctor: CreateDoctorDto, @Res() res): Promise<StatusDto> {
    const result = await this.doctorService.insert(doctor);
    return this.sendResult(result, res);
  }

  @Put(':id')
  @ApiBody({ type: CreateDoctorDto })
  async update(
    @Param('id', new ParseIntPipe()) id: number,
    @Body() doctor: CreateDoctorDto,
    @Res() res
  ): Promise<StatusDto> {
    const result = await this.doctorService.update(id, doctor);
    return this.sendResult(result, res);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number, @Res() res): Promise<StatusDto> {
    const result = await this.doctorService.delete(id);
    return this.sendResult(result, res);
  }

  sendResult(result: StatusDto, res): Promise<StatusDto> {
    if (!result.success) {
      return res.status(HttpStatus.BAD_REQUEST).send(result);
    }
    return res.status(HttpStatus.OK).send(result);
  }
}
