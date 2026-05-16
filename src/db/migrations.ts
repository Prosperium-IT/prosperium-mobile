import { schemaMigrations, addColumns, createTable } from '@nozbe/watermelondb/Schema/migrations'

export const migrations = schemaMigrations({
  migrations: [
    {
      toVersion: 2,
      steps: [
        addColumns({
          table: 'lancamentos',
          columns: [{ name: 'pendente_revisao', type: 'boolean' }],
        }),
      ],
    },
    {
      toVersion: 3,
      steps: [
        createTable({
          name: 'dashboard_cache',
          columns: [
            { name: 'timestamp', type: 'number' },
            { name: 'items', type: 'string' },
          ],
        }),
      ],
    },
  ],
})
