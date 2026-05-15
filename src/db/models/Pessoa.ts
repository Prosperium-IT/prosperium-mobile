import { Model } from '@nozbe/watermelondb'
import { field, readonly, date, text } from '@nozbe/watermelondb/decorators'
import type { SyncStatus } from './Lancamento'

export class Pessoa extends Model {
  static table = 'pessoas'

  @text('external_id') externalId!: string | null
  @field('server_id') serverId!: number | null
  @text('nome') nome!: string
  @text('tipo') tipo!: 'F' | 'J'
  @text('cpf_cnpj') cpfCnpj!: string | null
  @text('email') email!: string | null
  @text('telefone') telefone!: string | null
  @text('sync_status') syncStatus!: SyncStatus
  @readonly @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date
}
