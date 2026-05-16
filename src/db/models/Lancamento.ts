import { Model } from '@nozbe/watermelondb'
import { field, readonly, date, text } from '@nozbe/watermelondb/decorators'

export type SyncState = 'pending' | 'syncing' | 'synced' | 'error'

export class Lancamento extends Model {
  static table = 'lancamentos'

  @text('external_id') externalId!: string | null
  @field('server_id') serverId!: number | null
  @text('data_lancamento') dataLancamento!: string
  @field('valor') valor!: number
  @field('vlr_pgto') vlrPgto!: number | null
  @text('descricao') descricao!: string
  @field('natureza') natureza!: 1 | 2
  @field('id_conta_caixa') idContaCaixa!: number | null
  @field('id_conta_contabil') idContaContabil!: number | null
  @field('id_pessoa') idPessoa!: number | null
  @field('id_operacao') idOperacao!: number | null
  @field('id_un_negocio') idUnNegocio!: number | null
  @field('id_tp_lcto') idTpLcto!: number | null
  @text('status_pgto') statusPgto!: string
  @text('observacoes') observacoes!: string | null
  @text('sync_status') syncState!: SyncState
  @text('sync_error') syncError!: string | null
  @field('pendente_revisao') pendenteRevisao!: boolean
  @readonly @date('created_at') createdAt!: Date
  @date('updated_at') updatedAt!: Date
}
