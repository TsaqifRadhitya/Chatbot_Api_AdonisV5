import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Messages extends BaseSchema {
  protected tableName = 'messages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.enum("sender_type", ["question", "answer"])
      table.text('message')
      table.timestamp('created_at')
      table.timestamp('updated_at')
      table.integer('conversation_id').unsigned().references("id").inTable("conversations").onDelete("CASCADE")
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
