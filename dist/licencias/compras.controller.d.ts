import { ComprarDto } from './dto';
import { LicenciasService } from './licencias.service';
export declare class ComprasController {
    private readonly licencias;
    constructor(licencias: LicenciasService);
    comprar(dto: ComprarDto, sub: string): Promise<{
        eventoPublicado: boolean;
        id: string;
        juegoId: string;
        usuarioSub: string;
        estado: string;
        adquiridaEn: Date;
        revocadaEn: Date | null;
        revocadaPor: string | null;
    }>;
}
