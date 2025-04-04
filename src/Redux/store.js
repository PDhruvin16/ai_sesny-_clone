// import { configureStore } from '@reduxjs/toolkit';
// import { persistStore, persistReducer } from 'redux-persist';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { combineReducers } from 'redux';
// import authReducer from './authSlice'

// const persistConfig = {
//   key: 'root',
//   storage: AsyncStorage,
//   whitelist: ['auth'], // Persist only the auth slice
// };

// const rootReducer = combineReducers({
//   auth: authReducer,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);

// export const store = configureStore({
//   reducer: persistedReducer,
// });

// export const persistor = persistStore(store);
import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { combineReducers } from 'redux';
import authReducer from './authSlice';
import chatReducer from './chatSlice';
const persistConfig = {
  key: 'root',
  storage: AsyncStorage,
  whitelist: ['auth'], // Persist only the auth slice
};

const rootReducer = combineReducers({
  auth: authReducer,
  chat:chatReducer
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore non-serializable values from Redux Persist
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);



 // useEffect(() => {
   
  //   socket.on('newIncomingMessage', data => {
  //     console.log('New Incoming Message:', data);
  
  //     if (data.conversationId) {
  //       setUnreadCounts(prevCounts => {
  //         const newCount = (prevCounts[data.conversationId] || 0) + 1;
  //         console.log(`Unread Count for ${data.conversationId}:`, newCount); // Log unread count
  //         return {
  //           ...prevCounts,
  //           [data.conversationId]: newCount,
  //         };
  //       });
  
  //       // Update the chat list with the new message and timestamp
  //       setChats(prevChats => {
  //         const existingChatIndex = prevChats.findIndex(
  //           chat => chat._id === data.conversationId,
  //         );
  
  //         const currentTime = new Date().toISOString();
  //         // const newMessage = data.text;
  //         const newMessage = { text: data.text };

  
  //         if (existingChatIndex !== -1) {
  //           const updatedChat = {
  //             ...prevChats[existingChatIndex],
  //             lastText: newMessage,
  //             updatedAt: currentTime,
  //             unreadCount: (prevChats[existingChatIndex].unreadCount || 0) + 1,
  //           };
  
          
  //           const updatedChats = [
  //             updatedChat,
  //             ...prevChats.filter((_, index) => index !== existingChatIndex),
  //           ];
  //           return updatedChats;
  //         } else {
  //           const newChat = {
  //             _id: data.conversationId,
  //             // lastMessage: newMessage,
  //             lastText: { text: data.text },
  //             updatedAt: currentTime,
  //             receiverData: [{phoneNumber: data.senderPhoneNumber}],
  //             unreadCount: 1,
  //           };
  
  //           return [newChat, ...prevChats];
  //         }
  //       });
  //     }
  //   });
  // }, []);