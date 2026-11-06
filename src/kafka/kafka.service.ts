import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import {
  compatibilityPartitioner,
  ProduceAcks,
  Producer,
  stringSerializers,
} from '@platformatic/kafka';
import { aMensaje } from './mensaje';
import { TOPICS } from './topicos';

@Injectable()
export class KafkaService implements OnModuleDestroy {
  private readonly logger = new Logger(KafkaService.name);
  private readonly producer: Producer<string, string, string, string>;

  constructor() {
    const bootstrapBrokers = (process.env.KAFKA_BROKERS ?? 'localhost:9092')
      .split(',')
      .map((broker) => broker.trim())
      .filter(Boolean);

    this.producer = new Producer({
      clientId: 'vidalstore-licencias',
      bootstrapBrokers,
      serializers: stringSerializers,
      idempotent: true,
      acks: ProduceAcks.ALL,
      retries: 10,
      partitioner: compatibilityPartitioner,
      autocreateTopics: false,
    });
  }

  async publicarCompra(evento: Record<string, unknown>, usuarioSub: string): Promise<void> {
    const mensaje = aMensaje(TOPICS.compras, usuarioSub, evento, 'compra.realizada');
    await this.producer.send({
      messages: [mensaje],
      acks: ProduceAcks.ALL,
      idempotent: true,
    });
    this.logger.log(`vidalstore.compras publicado para ${usuarioSub}`);
  }

  async publicarRevocacion(evento: Record<string, unknown>, usuarioSub: string): Promise<void> {
    const mensaje = aMensaje(TOPICS.compras, usuarioSub, evento, 'licencia.revocada');
    await this.producer.send({
      messages: [mensaje],
      acks: ProduceAcks.ALL,
      idempotent: true,
    });
    this.logger.log(`vidalstore.compras publicado para ${usuarioSub}`);
  }

  async onModuleDestroy(): Promise<void> {
    await this.producer.close();
  }
}
