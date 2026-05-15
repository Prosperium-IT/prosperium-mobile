import { useEffect, useState } from 'react'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import Operacao from '@/db/models/Operacao'

export function useOperacoes(search: string = '') {
  const database = useDatabase()
  const [operacoes, setOperacoes] = useState<Operacao[]>([])
  useEffect(() => {
    const collection = database.get<Operacao>('operacoes')
    const query = search
      ? collection.query(Q.where('nome', Q.like(`%${Q.sanitizeLikeString(search)}%`)))
      : collection.query()
    const sub = query.observe().subscribe(setOperacoes)
    return () => sub.unsubscribe()
  }, [database, search])
  return operacoes
}

export function useOperacao(id: string | undefined) {
  const database = useDatabase()
  const [op, setOp] = useState<Operacao | null>(null)
  useEffect(() => {
    if (!id) return
    let cancelled = false
    database
      .get<Operacao>('operacoes')
      .find(id)
      .then((o) => !cancelled && setOp(o))
      .catch(() => !cancelled && setOp(null))
    return () => {
      cancelled = true
    }
  }, [database, id])
  return op
}
