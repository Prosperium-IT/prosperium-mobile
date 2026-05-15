import { Model } from '@nozbe/watermelondb'
import { field, readonly, date, text } from '@nozbe/watermelondb/decorators'
import type { SyncState } from './Lancamento'

export class Navio extends Model {
  static table = 'navios'

  @text('external_id') externalId!: string | null
  @field('server_id') serverId!: number | null
  @text('nome') nome!: string
  @text('imo') imo!: string | null
  @text('bandeira') bandeira!: string | null
  @text('tipo') tipo!: string | null
  @text('sync_status') syncState!: SyncState
  @readonly @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date
}
