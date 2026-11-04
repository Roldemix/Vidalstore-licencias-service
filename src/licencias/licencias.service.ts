import { ConflictException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryFailedError, Repository } from 'typeorm';
import { ROUTING_KEYS } from '../mensajeria/topologia';
import { RabbitService } from '../rabbit/rabbit.service';
import { Licencia } from './licencia.entity';

function esViolacionUnica(err: unknown): boolean {
  return err instanceof QueryFailedError && (err.driverError as { code?: string }).code === '23505';
}

@Injectable()
export class LicenciasService {
  private readonly logger = new Logger(LicenciasService.name);

  constructor(
    @InjectRepository(Licencia) private readonly repo: Repository<Licencia>,
    private readonly rabbit: RabbitService,
  ) {}

  async comprar(juegoId: string, usuarioSub: string) {
    let licencia: Licencia;
    try {
      licencia = await this.repo.save(
        this.repo.create({ juegoId, usuarioSub, estado: 'activa', adquiridaEn: new Date() }),
      );
    } catch (err) {
      if (esViolacionUnica(err)) {
        throw new ConflictException('Ya tienes una licencia activa de este juego');
      }
      throw err;
    }
    const eventoPublicado = await this.publicar(ROUTING_KEYS.compraRealizada, licencia.id, {
      licenciaId: licencia.id,
      juegoId: licencia.juegoId,
      usuarioSub: licencia.usuarioSub,
      adquiridaEn: licencia.adquiridaEn.toISOString(),
    });
    return { ...licencia, eventoPublicado };
  }

  bibliotecaDe(usuarioSub: string) {
    return this.repo.find({ where: { usuarioSub, estado: 'activa' }, order: { adquiridaEn: 'DESC' } });
  }

  listarTodas() {
    return this.repo.find({ order: { adquiridaEn: 'DESC' } });
  }

  async revocar(licenciaId: string, revocadaPor: string, motivo?: string) {
    const licencia = await this.repo.findOne({ where: { id: licenciaId } });
    if (!licencia) throw new NotFoundException('La licencia no existe');
    if (licencia.estado === 'revocada') {
      throw new ConflictException('La licencia ya estaba revocada');
    }

    const revocadaEn = new Date();
    // Update condicional: si dos revocaciones llegan juntas, solo una gana.
    const res = await this.repo.update(
      { id: licenciaId, estado: 'activa' },
      { estado: 'revocada', revocadaEn, revocadaPor },
    );
    if (!res.affected) throw new ConflictException('La licencia ya estaba revocada');

    const eventoPublicado = await this.publicar(ROUTING_KEYS.licenciaRevocada, licenciaId, {
      licenciaId,
      juegoId: licencia.juegoId,
      usuarioSub: licencia.usuarioSub, // el jugador dueño: sale de la fila, nunca del cliente
      revocadaPor, // el administrador: sale del token
      motivo: motivo?.trim() || 'Sin motivo indicado',
    });
    return { ...licencia, estado: 'revocada', revocadaEn, revocadaPor, eventoPublicado };
  }

  private async publicar(routingKey: string, licenciaId: string, payload: object): Promise<boolean> {
    try {
      const eventoId = await this.rabbit.publicarEvento(routingKey, payload);
      this.logger.log(`${routingKey} publicado (licencia ${licenciaId}, evento ${eventoId})`);
      return true;
    } catch (err) {
      const motivo = err instanceof Error ? err.message : String(err);
      // La licencia ya quedó escrita pero el evento no salió: es la ventana de la pregunta 11.
      this.logger.error(`EVENTO NO PUBLICADO ${routingKey} (licencia ${licenciaId}): ${motivo}`);
      return false;
    }
  }
}