import { OnModuleDestroy } from '@nestjs/common';
export declare class KafkaService implements OnModuleDestroy {
    private readonly logger;
    private readonly producer;
    constructor();
    publicarCompra(evento: Record<string, unknown>, usuarioSub: string): Promise<void>;
    publicarRevocacion(evento: Record<string, unknown>, usuarioSub: string): Promise<void>;
    onModuleDestroy(): Promise<void>;
}
