import { useEffect, useState } from 'react'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import Navio from '@/db/models/Navio'

export function useNavios(search: string = '') {
  const database = useDatabase()
  const [navios, setNavios] = useState<Navio[]>([])

  useEffect(() => {
    const collection = database.get<Navio>('navios')
    const query = search
      ? collection.query(Q.where('nome', Q.like(`%${Q.sanitizeLikeString(search)}%`)))
      : collection.query()
    const sub = query.observe().subscribe(setNavios)
    return () => sub.unsubscribe()
  }, [database, search])

  return navios
}

export function useNavio(id: string | undefined) {
  const database = useDatabase()
  const [navio, setNavio] = useState<Navio | null>(null)
  useEffect(() => {
    if (!id) return
    let cancelled = false
    database
      .get<Navio>('navios')
      .find(id)
      .then((n) => !cancelled && setNavio(n))
      .catch(() => !cancelled && setNavio(null))
    return () => {
      cancelled = true
    }
  }, [database, id])
  return navio
}
