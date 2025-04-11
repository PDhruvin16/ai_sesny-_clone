export const ReceiverDataSchema = {
    name: 'ReceiverData',
    embedded: true, // 👈 embedded since it's nested inside Conversation
    properties: {
      _id: 'string?',
      email: 'string?',
      phoneNumber: 'string?',
    },
  };
  
  export const LastTextSchema = {
    name: 'LastText',
    embedded: true, // 👈 embedded since it's nested
    properties: {
      _id: 'string?',
      text: 'string?',
      conversationId: 'string?',
      to: 'int?',
      from: 'int?',
      type: 'string?',
      IsIncoming: 'bool?',
      textId: 'string?',
      status: 'string?',
      createdAt: 'date?',
      updatedAt: 'date?',
    },
  };
  
  export const ConversationSchema = {
    name: 'Conversation',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      senderId: 'string?',
      isDeleted: 'bool?',
      lastTextId: 'string?',
      unreadCount: 'int?',
      createdAt: 'date?',
      updatedAt: 'date?',
      receiverData: 'ReceiverData?',
      lastText: 'LastText?',
    },
  };
  
  // messageSchema.js
export const MessageSchema = {
    name: 'Message',
    primaryKey: '_id',
    properties: {
      _id: 'string',
      conversationId: 'string',
      text: 'string?',
      to: 'int?',
      from: 'int?',
      type: 'string?',
      chatBotMessage: 'string?',
      IsIncoming: 'bool?',
      IsChatbot: 'bool?',
      textId: 'string',
      status: 'string',
      mediaUrl: 'string?',
      createdAt: 'date',
      updatedAt: 'date',

    },
  };
  