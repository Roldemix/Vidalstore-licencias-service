import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RabbitService } from '../rabbit/rabbit.service';
import { BibliotecaController } from './biblioteca.controller';
import { ComprasController } from './compras.controller';
import { Licencia } from './licencia.entity';
import { LicenciasController } from './licencias.controller';
import { LicenciasService } from './licencias.service';

@Module({
  imports: [TypeOrmModule.forFeature([Licencia])],
  controllers: [ComprasController, BibliotecaController, LicenciasController],
  providers: [LicenciasService, RabbitService],
})
export class LicenciasModule {}