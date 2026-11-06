"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TokenSub = void 0;
const common_1 = require("@nestjs/common");
exports.TokenSub = (0, common_1.createParamDecorator)((_data, ctx) => ctx.switchToHttp().getRequest().user.sub);
//# sourceMappingURL=token-sub.decorator.js.map