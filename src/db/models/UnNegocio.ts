import { Model } from '@nozbe/watermelondb'
import { field, text } from '@nozbe/watermelondb/decorators'

export class UnNegocio extends Model {
  static table = 'un_negocios'
  @field('server_id') serverId!: number
  @text('nome') nome!: string
  @text('codigo') codigo!: string | null
}
