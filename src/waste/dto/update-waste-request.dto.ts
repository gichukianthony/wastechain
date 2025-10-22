import { PartialType } from '@nestjs/mapped-types';
import { CreateWasteRequestDto } from './create-waste-request.dto';

export class UpdateWasteRequestDto extends PartialType(CreateWasteRequestDto) {}
