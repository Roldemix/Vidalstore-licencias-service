import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
export declare class JwtAuthGuard implements CanActivate {
    private readonly verifier;
    constructor(config: ConfigService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
