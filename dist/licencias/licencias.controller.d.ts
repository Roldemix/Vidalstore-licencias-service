import { RevocarDto } from './dto';
import { LicenciasService } from './licencias.service';
export declare class LicenciasController {
    private readonly licencias;
    constructor(licencias: LicenciasService);
    listar(): Promise<import("./licencia.entity").Licencia[]>;
    revocar(licenciaId: string, dto: RevocarDto, sub: string): Promise<{
        estado: string;
        revocadaEn: Date;
        revocadaPor: string;
        eventoPublicado: boolean;
        id: string;
        juegoId: string;
        usuarioSub: string;
        adquiridaEn: Date;
    }>;
}
