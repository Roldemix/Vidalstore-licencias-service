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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Licencia = void 0;
const typeorm_1 = require("typeorm");
let Licencia = class Licencia {
    id;
    juegoId;
    usuarioSub;
    estado;
    adquiridaEn;
    revocadaEn;
    revocadaPor;
};
exports.Licencia = Licencia;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Licencia.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'juego_id', type: 'text' }),
    __metadata("design:type", String)
], Licencia.prototype, "juegoId", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'usuario_sub', type: 'text' }),
    __metadata("design:type", String)
], Licencia.prototype, "usuarioSub", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'text', default: 'activa' }),
    __metadata("design:type", String)
], Licencia.prototype, "estado", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'adquirida_en', type: 'timestamptz' }),
    __metadata("design:type", Date)
], Licencia.prototype, "adquiridaEn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'revocada_en', type: 'timestamptz', nullable: true }),
    __metadata("design:type", Object)
], Licencia.prototype, "revocadaEn", void 0);
__decorate([
    (0, typeorm_1.Column)({ name: 'revocada_por', type: 'text', nullable: true }),
    __metadata("design:type", Object)
], Licencia.prototype, "revocadaPor", void 0);
exports.Licencia = Licencia = __decorate([
    (0, typeorm_1.Entity)({ name: 'licencias', schema: 'licencias' }),
    (0, typeorm_1.Index)('uq_licencia_activa', ['usuarioSub', 'juegoId'], {
        unique: true,
        where: `"estado" = 'activa'`,
    }),
    (0, typeorm_1.Index)('idx_licencias_usuario', ['usuarioSub']),
    (0, typeorm_1.Check)('chk_licencia_estado', `"estado" IN ('activa','revocada')`)
], Licencia);
//# sourceMappingURL=licencia.entity.js.map