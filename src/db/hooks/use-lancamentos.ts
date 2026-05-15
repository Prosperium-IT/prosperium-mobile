import { useEffect, useState } from 'react'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { Lancamento } from '@/db/models/Lancamento'
import { generateExternalId } from '@/db/sync/uuid-generator'

export function useLancamentos(opts: { search?: string; apenasAuditoria?: boolean } = {}) {
  const database = useDatabase()
  const [lancamentos, setLancamentos] = useState<Lancamento[]>([])

  useEffect(() => {
    const conditions: Q.Clause[] = []
    if (opts.search) {
      conditions.push(Q.where('descricao', Q.like(`%${Q.sanitizeLikeString(opts.search)}%`)))
    }
    if (opts.apenasAuditoria) {
      conditions.push(Q.where('pendente_revisao', true))
    }
    const query = database.get<Lancamento>('lancamentos').query(...conditions)
    const sub = query.observe().subscribe(setLancamentos)
    return () => sub.unsubscribe()
  }, [database, opts.search, opts.apenasAuditoria])

  return lancamentos
}

export function useLancamento(id: string | undefined) {
  const database = useDatabase()
  const [lancamento, setLancamento] = useState<Lancamento | null>(null)

  useEffect(() => {
    if (!id) {
      setLancamento(null)
      return
    }
    let cancelled = false
    database
      .get<Lancamento>('lancamentos')
      .find(id)
      .then((l) => {
        if (!cancelled) setLancamento(l)
      })
      .catch(() => {
        if (!cancelled) setLancamento(null)
      })
    return () => {
      cancelled = true
    }
  }, [database, id])

  return lancamento
}

export interface LancamentoInput {
  dataLancamento: string
  valor: number
  natureza: 1 | 2
  descricao?: string
  idPessoa?: number | null
  idTpLcto?: number | null
  idUnNegocio?: number | null
  observacoes?: string | null
  pendenteRevisao?: boolean
}

export async function createLancamento(
  database: ReturnType<typeof useDatabase>,
  input: LancamentoInput,
): Promise<Lancamento> {
  let lancamento!: Lancamento
  await database.write(async () => {
    lancamento = await database.get<Lancamento>('lancamentos').create((l: any) => {
      l._raw.external_id = generateExternalId()
      l._raw.server_id = null
      l._raw.data_lancamento = input.dataLancamento
      l._raw.valor = input.valor
      l._raw.vlr_pgto = null
      l._raw.descricao = input.descricao ?? ''
      l._raw.natureza = input.natureza
      l._raw.id_pessoa = input.idPessoa ?? null
      l._raw.id_tp_lcto = input.idTpLcto ?? null
      l._raw.id_un_negocio = input.idUnNegocio ?? null
      l._raw.id_conta_caixa = null
      l._raw.id_conta_contabil = null
      l._raw.id_operacao = null
      l._raw.status_pgto = 'em_aberto'
      l._raw.observacoes = input.observacoes ?? null
      l._raw.pendente_revisao = input.pendenteRevisao ?? false
      l._raw.sync_status = 'pending'
      l._raw.sync_error = null
    })
  })
  return lancamento
}

export async function updateLancamento(
  lancamento: Lancamento,
  input: Partial<LancamentoInput>,
): Promise<void> {
  await lancamento.update((l: any) => {
    if (input.dataLancamento !== undefined) l._raw.data_lancamento = input.dataLancamento
    if (input.valor !== undefined) l._raw.valor = input.valor
    if (input.natureza !== undefined) l._raw.natureza = input.natureza
    if (input.descricao !== undefined) l._raw.descricao = input.descricao
    if (input.idPessoa !== undefined) l._raw.id_pessoa = input.idPessoa
    if (input.idTpLcto !== undefined) l._raw.id_tp_lcto = input.idTpLcto
    if (input.idUnNegocio !== undefined) l._raw.id_un_negocio = input.idUnNegocio
    if (input.observacoes !== undefined) l._raw.observacoes = input.observacoes
    if (input.pendenteRevisao !== undefined) l._raw.pendente_revisao = input.pendenteRevisao
    l._raw.sync_status = 'pending'
  })
}

export async function deleteLancamento(lancamento: Lancamento): Promise<void> {
  await lancamento.markAsDeleted()
}
