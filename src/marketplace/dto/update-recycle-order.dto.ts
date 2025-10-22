import { PartialType } from '@nestjs/mapped-types';
import { CreateRecycleOrderDto } from './create-recycle-order.dto';

export class UpdateRecycleOrderDto extends PartialType(CreateRecycleOrderDto) {}
