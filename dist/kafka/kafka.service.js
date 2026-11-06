"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var KafkaService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.KafkaService = void 0;
const common_1 = require("@nestjs/common");
const kafka_1 = require("@platformatic/kafka");
const mensaje_1 = require("./mensaje");
const topicos_1 = require("./topicos");
let KafkaService = KafkaService_1 = class KafkaService {
    logger = new common_1.Logger(KafkaService_1.name);
    producer;
    constructor() {
        const bootstrapBrokers = (process.env.KAFKA_BROKERS ?? 'localhost:9092')
            .split(',')
            .map((broker) => broker.trim())
            .filter(Boolean);
        this.producer = new kafka_1.Producer({
            clientId: 'vidalstore-licencias',
            bootstrapBrokers,
            serializers: kafka_1.stringSerializers,
            idempotent: true,
            acks: kafka_1.ProduceAcks.ALL,
            retries: 10,
            partitioner: kafka_1.compatibilityPartitioner,
            autocreateTopics: false,
        });
    }
    async publicarCompra(evento, usuarioSub) {
        const mensaje = (0, mensaje_1.aMensaje)(topicos_1.TOPICS.compras, usuarioSub, evento, 'compra.realizada');
        await this.producer.send({
            messages: [mensaje],
            acks: kafka_1.ProduceAcks.ALL,
            idempotent: true,
        });
        this.logger.log(`vidalstore.compras publicado para ${usuarioSub}`);
    }
    async publicarRevocacion(evento, usuarioSub) {
        const mensaje = (0, mensaje_1.aMensaje)(topicos_1.TOPICS.compras, usuarioSub, evento, 'licencia.revocada');
        await this.producer.send({
            messages: [mensaje],
            acks: kafka_1.ProduceAcks.ALL,
            idempotent: true,
        });
        this.logger.log(`vidalstore.compras publicado para ${usuarioSub}`);
    }
    async onModuleDestroy() {
        await this.producer.close();
    }
};
exports.KafkaService = KafkaService;
exports.KafkaService = KafkaService = KafkaService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], KafkaService);
//# sourceMappingURL=kafka.service.js.map