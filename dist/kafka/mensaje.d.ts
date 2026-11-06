export interface EventoKafka {
    topic: string;
    key: string;
    value: string;
    headers: Record<string, string>;
}
export declare function aMensaje(topic: string, usuarioSub: string, evento: Record<string, unknown>, tipoEvento: string): EventoKafka;
export declare function topicDeCompra(): string;
