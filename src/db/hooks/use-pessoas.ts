import { useEffect, useState } from 'react'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { Pessoa } from '@/db/models/Pessoa'

export function usePessoas(search: string = '') {
  const database = useDatabase()
  const [pessoas, setPessoas] = useState<Pessoa[]>([])

  useEffect(() => {
    const collection = database.get<Pessoa>('pessoas')
    const query = search
      ? collection.query(Q.where('nome', Q.like(`%${Q.sanitizeLikeString(search)}%`)))
      : collection.query()
    const sub = query.observe().subscribe(setPessoas)
    return () => sub.unsubscribe()
  }, [database, search])

  return pessoas
}

export function usePessoa(id: string | undefined) {
  const database = useDatabase()
  const [pessoa, setPessoa] = useState<Pessoa | null>(null)

  useEffect(() => {
    if (!id) {
      setPessoa(null)
      return
    }
    let cancelled = false
    database
      .get<Pessoa>('pessoas')
      .find(id)
      .then((p) => {
        if (!cancelled) setPessoa(p)
      })
      .catch(() => {
        if (!cancelled) setPessoa(null)
      })
    return () => {
      cancelled = true
    }
  }, [database, id])

  return pessoa
}
