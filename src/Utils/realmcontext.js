// // src/Database/RealmContext.js
// import React, {createContext, useContext, useEffect, useState} from 'react';
// import Realm from 'realm';
// import { ConversationSchema, LastTextSchema, MessageSchema, ReceiverDataSchema } from './ConversationSchema';


// const RealmContext = createContext();

// export const RealmProvider = ({children}) => {
//   const [realmInstance, setRealmInstance] = useState(null);

//   useEffect(() => {
//     const openRealm = async () => {
//       try {
//         const realm = await Realm.open({
//           schema: [ConversationSchema, ReceiverDataSchema, LastTextSchema, MessageSchema],
//           schemaVersion: 1,
//         });
//         setRealmInstance(realm);
//       } catch (error) {
//         console.error('Error opening Realm:', error);
//       }
//     };

//     openRealm();

//     return () => {
//       // Cleanup on unmount
//       if (realmInstance && !realmInstance.isClosed) {
//         realmInstance.close();
//       }
//     };
//   }, []);

//   if (!realmInstance) return null; // optionally show loader

//   return (
//     <RealmContext.Provider value={realmInstance}>
//       {children}
//     </RealmContext.Provider>
//   );
// };

// export const useRealm = () => useContext(RealmContext);
import {createRealmContext} from '@realm/react';
import { ConversationSchema, LastTextSchema, MessageSchema, ReceiverDataSchema } from './conversationSchema';


export let {RealmProvider, useRealm, useQuery, useObject} = createRealmContext({
  schema: [
    ConversationSchema, MessageSchema,LastTextSchema,ReceiverDataSchema ],
  deleteRealmIfMigrationNeeded: true,
  path: 'default.realm',
});
