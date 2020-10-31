import { Body, Controller, Delete, Get, HttpStatus, Param, ParseIntPipe, Post, Res } from '@nestjs/common';
import { WorkTimeDto } from '../common/dto/work-time.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import { StatusDto } from '../common/dto/status.dto';
import { CreateWorkTimeDto } from '../common/dto/create-work-time.dto';
import { WorkTimeService } from './work-time.service';

@ApiTags('work-time')
@Controller('work-time')
export class WorkTimeController {
  constructor(private readonly workTimeService: WorkTimeService) {}

  @Get()
  async findAll(): Promise<WorkTimeDto[]> {
    return await this.workTimeService.findAll();
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  async findOne(@Param('id', new ParseIntPipe()) id: number, @Res() res): Promise<WorkTimeDto> {
    const result = await this.workTimeService.findOne(id);
    if (result) {
      return res.status(HttpStatus.OK).send(result);
    } else {
      return res
        .status(HttpStatus.NOT_FOUND)
        .send(new StatusDto({ success: false, message: `id:${id}, row not found` }));
    }
  }

  @Post()
  @ApiBody({ type: CreateWorkTimeDto })
  async save(@Body() workTime: CreateWorkTimeDto, @Res() res): Promise<StatusDto> {
    const result = await this.workTimeService.insert(workTime);
    return this.sendResult(result, res);
  }

  @Delete(':id')
  async delete(@Param('id', new ParseIntPipe()) id: number, @Res() res): Promise<StatusDto> {
    const result = await this.workTimeService.delete(id);
    return this.sendResult(result, res);
  }

  sendResult(result: StatusDto, res): Promise<StatusDto> {
    if (!result.success) {
      return res.status(HttpStatus.BAD_REQUEST).send(result);
    }
    return res.status(HttpStatus.OK).send(result);
  }
}
