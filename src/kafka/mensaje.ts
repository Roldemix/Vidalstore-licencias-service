import { randomUUID } from 'crypto';
import { TOPICS } from './topicos';

export interface EventoKafka {
  topic: string;
  key: string;
  value: string;
  headers: Record<string, string>;
}

export function aMensaje(
  topic: string,
  usuarioSub: string,
  evento: Record<string, unknown>,
  tipoEvento: string,
): EventoKafka {
  const eventoId = randomUUID();
  const emitidoEn = new Date().toISOString();

  return {
    topic,
    key: usuarioSub,
    // Sobre version 1 completo en el value. Los headers se mantienen por
    // compatibilidad, pero el consumidor ya no depende de ellos.
    value: JSON.stringify({ ...evento, eventoId, tipo: tipoEvento, version: 1, emitidoEn }),
    headers: {
      'x-evento-id': eventoId,
      'x-tipo-evento': tipoEvento,
      'x-emitido-en': emitidoEn,
    },
  };
}

export function topicDeCompra(): string {
  return TOPICS.compras;
}
