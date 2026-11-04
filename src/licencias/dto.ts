import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

export class ComprarDto {
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  juegoId!: string;
}

export class RevocarDto {
  @IsOptional()
  @IsString()
  @MaxLength(300)
  motivo?: string;
}