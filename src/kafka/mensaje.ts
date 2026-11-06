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
    value: JSON.stringify(evento),
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
