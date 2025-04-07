import {getRealm} from './Database';
import Realm from 'realm';
export const syncConversationsToRealm = async conversations => {
  try {
    const realm = await getRealm();

    realm.write(() => {
      // Purane data ko delete karo
      realm.delete(realm.objects('Conversation'));

      // Naye data insert karo
      conversations.forEach(conv => {
        realm.create('Conversation', {
          _id: conv._id,
          senderId: conv.senderId,
          isDeleted: conv.isDeleted,
          lastTextId: conv.lastTextId,
          unreadCount: conv.unreadCount,
          createdAt: new Date(conv.createdAt),
          updatedAt: new Date(conv.updatedAt),
          receiverData: {
            _id: conv.receiverData._id,
            email: conv.receiverData.email,
            phoneNumber: conv.receiverData.phoneNumber,
          },
          lastText: conv.lastText
            ? {
                _id: conv.lastText._id,
                text: conv.lastText.text,
                conversationId: conv.lastText.conversationId,
                to: conv.lastText.to,
                from: conv.lastText.from,
                type: conv.lastText.type,
                IsIncoming: conv.lastText.IsIncoming,
                textId: conv.lastText.textId,
                status: conv.lastText.status,
                createdAt: new Date(conv.lastText.createdAt),
                updatedAt: new Date(conv.lastText.updatedAt),
              }
            : null,
        });
      });
    });
  } catch (error) {
    console.error('Error syncing conversations to Realm:', error);
  }
};

export const syncMessagesToRealm = async messages => {
  try {
    const realm = await getRealm();

    realm.write(() => {
      messages.forEach(msg => {
        // Defensive type checking
        const _id = typeof msg._id === 'string' ? msg._id : String(msg._id);
        const conversationId =
          typeof msg.conversationId === 'string'
            ? msg.conversationId
            : String(msg.conversationId);
        const updatedAt =
          typeof msg.updatedAt === 'string'
            ? msg.updatedAt
            : new Date(msg.updatedAt).toISOString();
        const createdAt =
          typeof msg.createdAt === 'string'
            ? msg.createdAt
            : new Date(msg.createdAt).toISOString();
        const text =
          typeof msg.text === 'string' ? msg.text : JSON.stringify(msg.text); // fallback to stringify object text

        realm.create(
          'Message',
          {
            _id,
            conversationId,
            text,
            IsIncoming: msg.IsIncoming,
            from: msg.from || '',
            type: msg.type || '',
            to: msg.to || '',
            textId: msg.textId || '',
            status: msg.status || '',
            createdAt,
            updatedAt,
          },
          Realm.UpdateMode.Modified,
        );
      });
    });
  } catch (error) {
    console.error('Error syncing messages to Realm:', error);
  }
};


  // realmhelper.js
  export const upsertMessageToRealm = async (messageData) => {
    const realm = await getRealm();
  
    realm.write(() => {
      realm.create('Message', {
        _id: messageData._id || '',
        conversationId: messageData.conversationId || '',
        text: typeof messageData.text === 'string' ? messageData.text : JSON.stringify(messageData.text),
        from: messageData.from !== undefined ? Number(messageData.from) : null, // ✅ convert to int
        to: messageData.to !== undefined ? Number(messageData.to) : null,       // ✅ convert to int
        IsIncoming: typeof messageData.IsIncoming === 'boolean' ? messageData.IsIncoming : false,
        status: messageData.status || 'message_sent',
        createdAt: new Date(messageData.createdAt || Date.now()),
        updatedAt: new Date(),
        type: messageData.type || '',
        textId: messageData.textId || '',
      }, Realm.UpdateMode.Modified);
    });
  };
  export const readMessagesFromRealm = async (conversationId) => {
    const realm = await getRealm();
    const realmMessages = realm
      .objects('Message')
      .filtered('conversationId == $0', conversationId)
      .sorted('createdAt', true);
  
    return realmMessages.map(msg => ({
      id: msg._id,
      text: msg.text,
      IsIncoming: msg.IsIncoming,
      from: msg.from,
      to: msg.to,
      status: msg.status,
      updatedAt: msg.updatedAt,
    }));
  };
  