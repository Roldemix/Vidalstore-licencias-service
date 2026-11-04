import { Check, Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'licencias', schema: 'licencias' })
// Un jugador no puede tener dos licencias vigentes del mismo juego, pero sí volver a comprarlo
// después de una revocación. La regla vive en la base, no en un if del controlador.
@Index('uq_licencia_activa', ['usuarioSub', 'juegoId'], {
  unique: true,
  where: `"estado" = 'activa'`,
})
@Index('idx_licencias_usuario', ['usuarioSub']) // GET /biblioteca consulta por usuario
@Check('chk_licencia_estado', `"estado" IN ('activa','revocada')`)
export class Licencia {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // Sin clave foránea: el catálogo lo sirve otro servicio.
  @Column({ name: 'juego_id', type: 'text' })
  juegoId!: string;

  @Column({ name: 'usuario_sub', type: 'text' })
  usuarioSub!: string;

  @Column({ type: 'text', default: 'activa' })
  estado!: string;

  @Column({ name: 'adquirida_en', type: 'timestamptz' })
  adquiridaEn!: Date;

  @Column({ name: 'revocada_en', type: 'timestamptz', nullable: true })
  revocadaEn!: Date | null;

  @Column({ name: 'revocada_por', type: 'text', nullable: true })
  revocadaPor!: string | null;
}