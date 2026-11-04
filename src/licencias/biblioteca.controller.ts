import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { TokenSub } from '../auth/token-sub.decorator';
import { LicenciasService } from './licencias.service';

@Controller('biblioteca')
@UseGuards(JwtAuthGuard)
export class BibliotecaController {
  constructor(private readonly licencias: LicenciasService) {}

  @Get()
  miBiblioteca(@TokenSub() sub: string) {
    return this.licencias.bibliotecaDe(sub);
  }
}