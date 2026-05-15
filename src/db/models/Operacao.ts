import { Model } from '@nozbe/watermelondb'
import { field, readonly, date, text } from '@nozbe/watermelondb/decorators'
import type { SyncStatus } from './Lancamento'

export class Operacao extends Model {
  static table = 'operacoes'

  @text('external_id') externalId!: string | null
  @field('server_id') serverId!: number | null
  @text('nome') nome!: string
  @text('codigo') codigo!: string | null
  @field('id_navio') idNavio!: number | null
  @field('id_porto') idPorto!: number | null
  @text('data_inicio') dataInicio!: string | null
  @text('data_fim_prevista') dataFimPrevista!: string | null
  @field('valor_previsto') valorPrevisto!: number | null
  @text('status') status!: string
  @text('observacoes') observacoes!: string | null
  @text('sync_status') syncStatus!: SyncStatus
  @readonly @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date
}
