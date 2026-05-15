import { Model } from '@nozbe/watermelondb'
import { field, text } from '@nozbe/watermelondb/decorators'

export class TpLcto extends Model {
  static table = 'tp_lctos'
  @field('server_id') serverId!: number
  @text('descricao') descricao!: string
  @field('natureza') natureza!: 1 | 2
  @text('codigo') codigo!: string | null
}
