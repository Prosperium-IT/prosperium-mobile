import { Model } from '@nozbe/watermelondb'
import { field, text } from '@nozbe/watermelondb/decorators'

export class DashboardCache extends Model {
  static table = 'dashboard_cache'

  @field('timestamp') timestamp!: number
  @text('items') items!: string // JSON stringificado
}
