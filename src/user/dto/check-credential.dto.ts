import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsString } from 'class-validator';

export enum CredentialType {
  EMAIL = 'EMAIL',
  NICKNAME = 'NICKNAME',
}

export class CheckCredentialDto {
  @ApiProperty({
    enum: CredentialType,
  })
  @IsEnum(CredentialType)
  @IsNotEmpty()
  type: CredentialType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  value: string;
}
