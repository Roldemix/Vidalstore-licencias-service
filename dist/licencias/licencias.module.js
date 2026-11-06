"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LicenciasModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const rabbit_service_1 = require("../rabbit/rabbit.service");
const biblioteca_controller_1 = require("./biblioteca.controller");
const compras_controller_1 = require("./compras.controller");
const licencia_entity_1 = require("./licencia.entity");
const licencias_controller_1 = require("./licencias.controller");
const licencias_service_1 = require("./licencias.service");
const kafka_module_1 = require("../kafka/kafka.module");
let LicenciasModule = class LicenciasModule {
};
exports.LicenciasModule = LicenciasModule;
exports.LicenciasModule = LicenciasModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([licencia_entity_1.Licencia]), kafka_module_1.KafkaModule],
        controllers: [compras_controller_1.ComprasController, biblioteca_controller_1.BibliotecaController, licencias_controller_1.LicenciasController],
        providers: [licencias_service_1.LicenciasService, rabbit_service_1.RabbitService],
    })
], LicenciasModule);
//# sourceMappingURL=licencias.module.js.map