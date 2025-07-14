// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { HttpContext } from "@adonisjs/core/build/standalone"
import { ValidationException } from "@ioc:Adonis/Core/Validator"
import Conversation from "App/Models/Conversation"
import Message from "App/Models/Message"
import ChatValidator from "App/Validators/ChatValidator"
import axios from "axios"
import { v4 as uuid } from 'uuid';

export default class ChatsController {
  tryParseJSON = (str: string) => {
    try {
      return JSON.parse(str)
    } catch {
      return str
    }
  }

  public async index(ctx: HttpContext) {
    const page = Number(ctx.request.input('page', 1))
    const limit = Number(ctx.request.input('limit', 10))

    const conversations = await Conversation
      .query()
      .preload("messages")
      .paginate(page, limit)

    const paginated = conversations.toJSON()

    const formattedData = paginated.data.map((conversation) => {
      return {
        id: conversation.id,
        session_id: conversation.session_id,
        last_messages: this.tryParseJSON(conversation.last_messages),
        messages: conversation.messages.map((message: any) => ({
          id: message.id,
          sender_type: message.sender_type,
          message: this.tryParseJSON(message.message),
          createdAt: message.createdAt,
          updatedAt: message.updatedAt,
          conversationId: message.conversationId
        })),
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      }
    })

    return ctx.response.ok({
      status: 200,
      message: "success",
      meta: {
        ...paginated.meta,
      },
      data: formattedData
    })
  }


  public async show(ctx: HttpContext) {
    const { id } = ctx.request.params()


    if (!parseInt(id)) {
      return ctx.response.badRequest({
        status: 400,
        message: "Validation failure",
        error: "invalid id",
      })
    }
    const conversationData = await Conversation.query().where('id', id).preload("messages").first()

    if (!conversationData) {
      return ctx.response.notFound({
        status: 404,
        message: "not found",
        error: "data not found"
      })
    }

    return ctx.response.ok({
      status: 200,
      message: "success",
      data: {
        id: conversationData.id,
        session_id: conversationData.session_id,
        lastMessages: this.tryParseJSON(conversationData.last_messages),
        messages: conversationData.messages.map((msg) => ({
          id: msg.id,
          sender_type: msg.sender_type,
          message: this.tryParseJSON(msg.message),
          createdAt: msg.createdAt,
          updatedAt: msg.updatedAt,
          conversationId: msg.conversationId
        }))
      }
    })
  }

  public async store(ctx: HttpContext) {
    const bodyRequest = ctx.request.body()
    try {
      await ctx.request.validate(ChatValidator)
    } catch (error) {
      if (error instanceof ValidationException) {
        return ctx.response.badRequest({
          status: 400,
          message: 'Validation failure',
          errors: (error as any).messages.errors
        })
      }

    }
    if (bodyRequest.session_id && !(await Conversation.query().where("session_id", bodyRequest.session_id).first())) {
      return ctx.response.badRequest({
        status: 404,
        message: "not found",
        error: "conversation with your session_id is not found"
      })
    }

    const session_id = bodyRequest.session_id ?? uuid()

    const ress = await axios.post("https://api.majadigi.jatimprov.go.id/api/external/chatbot/send-message", {
      question: bodyRequest.message,
      session_id
    })

    const conversationData = await Conversation.updateOrCreate({
      session_id: session_id
    }, {
      last_messages: JSON.stringify(ress.data.data.message[0])
    })

    Message.createMany([
      {
        conversationId: conversationData.id,
        message: bodyRequest.message,
        sender_type: "question"
      },
      {
        conversationId: conversationData.id,
        message: JSON.stringify(ress.data.data.message[0]),
        sender_type: "answer"
      }
    ])

    return ctx.response.ok({
      status: 200,
      message: "success",
      session_id,
      data: ress.data.data.message
    })
  }

  public async destroy(ctx: HttpContext) {

    const { id } = ctx.request.params()

    if (!parseInt(id)) {
      return ctx.response.badRequest({
        status: 400,
        message: "Validation failure",
        error: [
          {
            message: "invalid id",
          }
        ]
      })
    }

    const conversationData = await Conversation.find(id)

    if (!conversationData) {
      return ctx.response.notFound({
        status: 404,
        message: "not found",
        error: "data not found"
      })
    }

    await conversationData.delete()

    return ctx.response.ok({
      status: 200,
      message: "success",
      data: {
        id: conversationData.id,
        session_id: conversationData.session_id,
        last_messages: this.tryParseJSON(conversationData.last_messages),
        createdAt: conversationData.createdAt,
        updatedAt: conversationData.updatedAt
      }
    })
  }

  public async destroyMessage(ctx: HttpContext) {
    const { id } = ctx.request.params()

    if (!parseInt(id)) {
      return ctx.response.badRequest({
        status: 400,
        message: "Validation failure",
        error: "invalid id",
      })
    }

    const messageData = await Message.find(id)

    if (!messageData) {
      return ctx.response.notFound({
        status: 404,
        message: "not found",
        error: "data not found"
      })
    }

    await messageData.delete()

    return ctx.response.ok({
      status: 200,
      message: "success",
      data: { ...messageData.toJSON(), message: this.tryParseJSON(messageData.message) }
    })
  }
}
