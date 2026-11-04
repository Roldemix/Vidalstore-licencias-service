import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TokenSub } from '../auth/token-sub.decorator';
import { ComprarDto } from './dto';
import { LicenciasService } from './licencias.service';

@Controller('compras')
@UseGuards(JwtAuthGuard)
export class ComprasController {
  constructor(private readonly licencias: LicenciasService) {}

  @Post()
  comprar(@Body() dto: ComprarDto, @TokenSub() sub: string) {
    return this.licencias.comprar(dto.juegoId, sub);
  }
}