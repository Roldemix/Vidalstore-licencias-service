import { Repository } from 'typeorm';
import { RabbitService } from '../rabbit/rabbit.service';
import { KafkaService } from '../kafka/kafka.service';
import { Licencia } from './licencia.entity';
export declare class LicenciasService {
    private readonly repo;
    private readonly rabbit;
    private readonly kafka;
    private readonly logger;
    constructor(repo: Repository<Licencia>, rabbit: RabbitService, kafka: KafkaService);
    comprar(juegoId: string, usuarioSub: string): Promise<{
        eventoPublicado: boolean;
        id: string;
        juegoId: string;
        usuarioSub: string;
        estado: string;
        adquiridaEn: Date;
        revocadaEn: Date | null;
        revocadaPor: string | null;
    }>;
    bibliotecaDe(usuarioSub: string): Promise<Licencia[]>;
    listarTodas(): Promise<Licencia[]>;
    revocar(licenciaId: string, revocadaPor: string, motivo?: string): Promise<{
        estado: string;
        revocadaEn: Date;
        revocadaPor: string;
        eventoPublicado: boolean;
        id: string;
        juegoId: string;
        usuarioSub: string;
        adquiridaEn: Date;
    }>;
    private publicarKafka;
    private publicar;
}
