import { useEffect, useState } from 'react'
import { Q } from '@nozbe/watermelondb'
import { useDatabase } from '@nozbe/watermelondb/react'
import { UnNegocio } from '@/db/models/UnNegocio'
import { useAuth } from '@/providers/auth-provider'

export function useUnNegociosPermitidos() {
  const database = useDatabase()
  const { user } = useAuth()
  const [uns, setUns] = useState<UnNegocio[]>([])

  useEffect(() => {
    const ids = user?.un_negocios_permitidas ?? []
    if (ids.length === 0) {
      const sub = database.get<UnNegocio>('un_negocios').query().observe().subscribe(setUns)
      return () => sub.unsubscribe()
    }
    const sub = database
      .get<UnNegocio>('un_negocios')
      .query(Q.where('server_id', Q.oneOf(ids)))
      .observe()
      .subscribe(setUns)
    return () => sub.unsubscribe()
  }, [database, user?.un_negocios_permitidas])

  return uns
}
