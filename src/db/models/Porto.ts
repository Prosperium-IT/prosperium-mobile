import { Model } from '@nozbe/watermelondb'
import { field, readonly, date, text } from '@nozbe/watermelondb/decorators'
import type { SyncState } from './Lancamento'

export class Porto extends Model {
  static table = 'portos'

  @text('external_id') externalId!: string | null
  @field('server_id') serverId!: number | null
  @text('nome') nome!: string
  @text('codigo_locode') codigoLocode!: string | null
  @text('pais') pais!: string | null
  @text('estado') estado!: string | null
  @text('sync_status') syncState!: SyncState
  @readonly @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date
}

export default Porto
