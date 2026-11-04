import { Body, Controller, Delete, Get, Param, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TokenSub } from '../auth/token-sub.decorator';
import { RevocarDto } from './dto';
import { LicenciasService } from './licencias.service';

@Controller('licencias')
@UseGuards(JwtAuthGuard)
export class LicenciasController {
  constructor(private readonly licencias: LicenciasService) {}

  @Get()
  listar() {
    return this.licencias.listarTodas();
  }

  @Delete(':licenciaId')
  revocar(
    @Param('licenciaId', new ParseUUIDPipe()) licenciaId: string,
    @Body() dto: RevocarDto,
    @TokenSub() sub: string,
  ) {
    return this.licencias.revocar(licenciaId, sub, dto?.motivo);
  }
}