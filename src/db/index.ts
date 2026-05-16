import { Database } from '@nozbe/watermelondb'
import SQLiteAdapter from '@nozbe/watermelondb/adapters/sqlite'
import { schema } from './schema'
import { migrations } from './migrations'
import { Lancamento } from './models/Lancamento'
import { Pessoa } from './models/Pessoa'
import { Operacao } from './models/Operacao'
import { Navio } from './models/Navio'
import { Porto } from './models/Porto'
import { UnNegocio } from './models/UnNegocio'
import { TpLcto } from './models/TpLcto'
import { DashboardCache } from './models/DashboardCache'

function createDatabase(tenant: string): Database {
  const adapter = new SQLiteAdapter({
    schema,
    migrations,
    dbName: `prosperium_${tenant}`,
    jsi: true,
    onSetUpError: (error) => {
      console.error('[WatermelonDB] Setup error:', error)
    },
  })

  return new Database({
    adapter,
    modelClasses: [Lancamento, Pessoa, Operacao, Navio, Porto, UnNegocio, TpLcto, DashboardCache],
  })
}

// Singleton lazy por tenant — recriado quando tenant muda
let _db: Database | null = null
let _dbTenant: string | null = null

export function getDatabase(tenant: string): Database {
  if (!_db || _dbTenant !== tenant) {
    _db = createDatabase(tenant)
    _dbTenant = tenant
  }
  return _db
}
