

import Realm from 'realm';

// import { ConversationSchema, ReceiverDataSchema, LastTextSchema } from './schemas/ConversationSchema';


import {ConversationSchema, ReceiverDataSchema, LastTextSchema, MessageSchema} from './conversationSchema';

export const getRealm = async () =>
  await Realm.open({
    schema: [ConversationSchema, ReceiverDataSchema, LastTextSchema,MessageSchema],
    schemaVersion: 1,
  });
