import { LicenciasService } from './licencias.service';
export declare class BibliotecaController {
    private readonly licencias;
    constructor(licencias: LicenciasService);
    miBiblioteca(sub: string): Promise<import("./licencia.entity").Licencia[]>;
}
