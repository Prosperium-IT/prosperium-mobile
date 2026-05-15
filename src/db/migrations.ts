import { schemaMigrations, addColumns } from '@nozbe/watermelondb/Schema/migrations'

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
  ],
})
