import { IsString, IsOptional, IsNumber, IsEnum, IsBoolean, IsUUID, IsLatitude, IsLongitude, MinLength, MaxLength } from 'class-validator';

export class CreateLocationDto {
    @IsString()
    @MinLength(5)
    @MaxLength(200)
    address: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    city?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    state?: string;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    country?: string;

    @IsOptional()
    @IsString()
    @MaxLength(20)
    postal_code?: string;

    @IsOptional()
    @IsLatitude()
    latitude?: number;

    @IsOptional()
    @IsLongitude()
    longitude?: number;

    @IsOptional()
    @IsString()
    @MaxLength(100)
    landmark?: string;

    @IsOptional()
    @IsString()
    @MaxLength(500)
    instructions?: string;

    @IsOptional()
    @IsEnum(['HOME', 'OFFICE', 'COMMERCIAL', 'INDUSTRIAL', 'OTHER'])
    location_type?: 'HOME' | 'OFFICE' | 'COMMERCIAL' | 'INDUSTRIAL' | 'OTHER';

    @IsOptional()
    @IsBoolean()
    is_active?: boolean;

    @IsOptional()
    @IsBoolean()
    is_primary?: boolean;

    @IsUUID()
    user_id: string;
}