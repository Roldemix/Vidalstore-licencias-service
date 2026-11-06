"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.aMensaje = aMensaje;
exports.topicDeCompra = topicDeCompra;
const crypto_1 = require("crypto");
const topicos_1 = require("./topicos");
function aMensaje(topic, usuarioSub, evento, tipoEvento) {
    const eventoId = (0, crypto_1.randomUUID)();
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
function topicDeCompra() {
    return topicos_1.TOPICS.compras;
}
//# sourceMappingURL=mensaje.js.map