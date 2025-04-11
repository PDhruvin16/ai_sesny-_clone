import React from 'react';
import {FlatList, StyleSheet} from 'react-native';
import RenderMessage from '../Rendermessge';
// import RenderMessage from './RenderMessage';

const MessageList = ({messages}) => {
  return (
    <FlatList
      data={messages}
      keyExtractor={item => item.id.toString()}
      renderItem={({item}) => <RenderMessage item={item} />}
      style={styles.messageList}
      contentContainerStyle={styles.messageListContent}
      inverted
    />
  );
};

const styles = StyleSheet.create({
  messageList: {
    flex: 1,
    paddingHorizontal: 10,
  },
  messageListContent: {
    flexGrow: 1,
    justifyContent: 'flex-end',
  },
});

export default MessageList;
