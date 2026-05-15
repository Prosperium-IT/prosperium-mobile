import { useEffect, useState } from 'react'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { TpLcto } from '@/db/models/TpLcto'

export function useTpLctos(natureza?: 1 | 2) {
  const database = useDatabase()
  const [tpLctos, setTpLctos] = useState<TpLcto[]>([])

  useEffect(() => {
    const collection = database.get<TpLcto>('tp_lctos')
    const query = natureza
      ? collection.query(Q.where('natureza', natureza))
      : collection.query()
    const sub = query.observe().subscribe(setTpLctos)
    return () => sub.unsubscribe()
  }, [database, natureza])

  return tpLctos
}
