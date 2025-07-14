import { DateTime } from 'luxon'
import { v4 as uuid } from 'uuid'
import { beforeCreate, BaseModel, column, belongsTo, BelongsTo } from '@ioc:Adonis/Lucid/Orm'
import User from './User'

export default class Post extends BaseModel {
  // for assign uuid
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public title: string

  @column()
  public content: string

  @column()
  public user_id: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // for assign uuid
  @beforeCreate()
  public static async createUUID(model: Post) {
    model.id = uuid()
  }

  // Relationship
  @belongsTo(() => User, {
    foreignKey: 'user_id', // default adonis is userId, in this case i use user_id
  })
  public user: BelongsTo<typeof User>
}
