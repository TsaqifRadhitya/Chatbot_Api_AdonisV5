import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { v4 as uuid } from 'uuid'
import {
  column,
  beforeSave,
  beforeCreate,
  BaseModel,
  hasMany,
  HasMany,
} from '@ioc:Adonis/Lucid/Orm'
import Post from './Post'

export default class User extends BaseModel {
  // for assign uuid
  public static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  public id: string

  @column()
  public name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public rememberMeToken?: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // for assign uuid
  @beforeCreate()
  public static async createUUID(model: User) {
    model.id = uuid()
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password)
    }
  }

  // Relationship
  @hasMany(() => Post, {
    foreignKey: 'user_id', // default adonis is userId, in this case i use user_id
  })
  public posts: HasMany<typeof Post>
}
