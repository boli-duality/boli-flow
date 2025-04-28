import { PartialType } from '@nestjs/mapped-types'
import { CreateExplorerDto } from './create-explorer.dto.js'

export class UpdateExplorerDto extends PartialType(CreateExplorerDto) {}
