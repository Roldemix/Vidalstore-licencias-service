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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BibliotecaController = void 0;
const common_1 = require("@nestjs/common");
const jwt_auth_guard_1 = require("../auth/jwt-auth.guard");
const token_sub_decorator_1 = require("../auth/token-sub.decorator");
const licencias_service_1 = require("./licencias.service");
let BibliotecaController = class BibliotecaController {
    licencias;
    constructor(licencias) {
        this.licencias = licencias;
    }
    miBiblioteca(sub) {
        return this.licencias.bibliotecaDe(sub);
    }
};
exports.BibliotecaController = BibliotecaController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, token_sub_decorator_1.TokenSub)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], BibliotecaController.prototype, "miBiblioteca", null);
exports.BibliotecaController = BibliotecaController = __decorate([
    (0, common_1.Controller)('biblioteca'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [licencias_service_1.LicenciasService])
], BibliotecaController);
//# sourceMappingURL=biblioteca.controller.js.map