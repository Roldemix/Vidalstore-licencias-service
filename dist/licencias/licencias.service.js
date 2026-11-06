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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var LicenciasService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenciasService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const topologia_1 = require("../mensajeria/topologia");
const rabbit_service_1 = require("../rabbit/rabbit.service");
const kafka_service_1 = require("../kafka/kafka.service");
const licencia_entity_1 = require("./licencia.entity");
function esViolacionUnica(err) {
    return err instanceof typeorm_2.QueryFailedError && err.driverError.code === '23505';
}
let LicenciasService = LicenciasService_1 = class LicenciasService {
    repo;
    rabbit;
    kafka;
    logger = new common_1.Logger(LicenciasService_1.name);
    constructor(repo, rabbit, kafka) {
        this.repo = repo;
        this.rabbit = rabbit;
        this.kafka = kafka;
    }
    async comprar(juegoId, usuarioSub) {
        let licencia;
        try {
            licencia = await this.repo.save(this.repo.create({ juegoId, usuarioSub, estado: 'activa', adquiridaEn: new Date() }));
        }
        catch (err) {
            if (esViolacionUnica(err)) {
                throw new common_1.ConflictException('Ya tienes una licencia activa de este juego');
            }
            throw err;
        }
        const eventoPublicado = await this.publicar(topologia_1.ROUTING_KEYS.compraRealizada, licencia.id, {
            licenciaId: licencia.id,
            juegoId: licencia.juegoId,
            usuarioSub: licencia.usuarioSub,
            adquiridaEn: licencia.adquiridaEn.toISOString(),
        });
        await this.publicarKafka({
            licenciaId: licencia.id,
            juegoId: licencia.juegoId,
            usuarioSub: licencia.usuarioSub,
            adquiridaEn: licencia.adquiridaEn.toISOString(),
        }, licencia.usuarioSub, 'compra');
        return { ...licencia, eventoPublicado };
    }
    bibliotecaDe(usuarioSub) {
        return this.repo.find({ where: { usuarioSub, estado: 'activa' }, order: { adquiridaEn: 'DESC' } });
    }
    listarTodas() {
        return this.repo.find({ order: { adquiridaEn: 'DESC' } });
    }
    async revocar(licenciaId, revocadaPor, motivo) {
        const licencia = await this.repo.findOne({ where: { id: licenciaId } });
        if (!licencia)
            throw new common_1.NotFoundException('La licencia no existe');
        if (licencia.estado === 'revocada') {
            throw new common_1.ConflictException('La licencia ya estaba revocada');
        }
        const revocadaEn = new Date();
        const res = await this.repo.update({ id: licenciaId, estado: 'activa' }, { estado: 'revocada', revocadaEn, revocadaPor });
        if (!res.affected)
            throw new common_1.ConflictException('La licencia ya estaba revocada');
        const eventoPublicado = await this.publicar(topologia_1.ROUTING_KEYS.licenciaRevocada, licenciaId, {
            licenciaId,
            juegoId: licencia.juegoId,
            usuarioSub: licencia.usuarioSub,
            revocadaPor,
            motivo: motivo?.trim() || 'Sin motivo indicado',
        });
        await this.publicarKafka({
            licenciaId,
            juegoId: licencia.juegoId,
            usuarioSub: licencia.usuarioSub,
            revocadaPor,
            motivo: motivo?.trim() || 'Sin motivo indicado',
        }, licencia.usuarioSub, 'revocacion');
        return { ...licencia, estado: 'revocada', revocadaEn, revocadaPor, eventoPublicado };
    }
    async publicarKafka(payload, usuarioSub, tipo) {
        try {
            if (tipo === 'compra') {
                await this.kafka.publicarCompra(payload, usuarioSub);
            }
            else {
                await this.kafka.publicarRevocacion(payload, usuarioSub);
            }
        }
        catch (err) {
            const motivo = err instanceof Error ? err.message : String(err);
            this.logger.error(`EVENTO KAFKA NO PUBLICADO (${tipo}, ${usuarioSub}): ${motivo}`);
        }
    }
    async publicar(routingKey, licenciaId, payload) {
        try {
            const eventoId = await this.rabbit.publicarEvento(routingKey, payload);
            this.logger.log(`${routingKey} publicado (licencia ${licenciaId}, evento ${eventoId})`);
            return true;
        }
        catch (err) {
            const motivo = err instanceof Error ? err.message : String(err);
            this.logger.error(`EVENTO NO PUBLICADO ${routingKey} (licencia ${licenciaId}): ${motivo}`);
            return false;
        }
    }
};
exports.LicenciasService = LicenciasService;
exports.LicenciasService = LicenciasService = LicenciasService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(licencia_entity_1.Licencia)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        rabbit_service_1.RabbitService,
        kafka_service_1.KafkaService])
], LicenciasService);
//# sourceMappingURL=licencias.service.js.map