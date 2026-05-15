import { useEffect, useState } from 'react'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import Porto from '@/db/models/Porto'

export function usePortos(search: string = '') {
  const database = useDatabase()
  const [portos, setPortos] = useState<Porto[]>([])
  useEffect(() => {
    const collection = database.get<Porto>('portos')
    const query = search
      ? collection.query(Q.where('nome', Q.like(`%${Q.sanitizeLikeString(search)}%`)))
      : collection.query()
    const sub = query.observe().subscribe(setPortos)
    return () => sub.unsubscribe()
  }, [database, search])
  return portos
}

export function usePorto(id: string | undefined) {
  const database = useDatabase()
  const [porto, setPorto] = useState<Porto | null>(null)
  useEffect(() => {
    if (!id) return
    let cancelled = false
    database
      .get<Porto>('portos')
      .find(id)
      .then((p) => !cancelled && setPorto(p))
      .catch(() => !cancelled && setPorto(null))
    return () => {
      cancelled = true
    }
  }, [database, id])
  return porto
}
