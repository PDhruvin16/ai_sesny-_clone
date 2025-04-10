import React from 'react';
import { View, Text, TouchableOpacity, Image, Linking, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';


const RenderMessage = ({ item }) => {
    let header = '';
    let body = '';
    let footer = '';
    let buttons = [];
    let messageText = 'Message not available';
    let lists = [];
    const formatTime = timestamp => {
      const date = new Date(timestamp);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };
  
    const getStatusIcon = status => {
      if (status?.startsWith('Error')) {
        return (
          <Icon
            name="error-outline"
            size={16}
            color="red"
            style={styles.statusIcon}
          />
        );
      }
      switch (status) {
        case 'message_delivered':
          return (
            <Icon
              name="done-all"
              size={16}
              color="#888"
              style={styles.statusIcon}
            />
          );
        case 'message_read':
          return (
            <Icon
              name="done-all"
              size={16}
              color="#34B7F1"
              style={styles.statusIcon}
            />
          );
        default:
          return (
            <Icon
              name="done"
              size={16}
              color="#888"
              style={styles.statusIcon}
            />
          );
      }
    };
    if (!item.IsIncoming && item.chatBotMessage) {
      const bot = item.chatBotMessage;





      // 🤖 OUTGOING CHATBOT MESSAGE
      if (bot?.lists?.length > 0) {
        lists = bot.lists.map((list, listIndex) => (
          <View key={`list-${listIndex}`} style={styles.listContainer}>
            {/* List Title */}
            {/* <Text style={styles.listTitle}>{list.title}</Text> */}
      
            {/* List Items */}
            {/* {list.rows.map((row, rowIndex) => (
              <TouchableOpacity
                key={`row-${row.id}-${rowIndex}`}
                style={styles.listRow}
                onPress={() => {
                  // Optional: You can trigger a function here like selectListRow(row)
                  console.log('Selected row:', row.title);
                }}>
                <Text style={styles.listRowTitle}>{row.title}</Text>
                {row.description && (
                  <Text style={styles.listRowDescription}>{row.description}</Text>
                )}
              </TouchableOpacity>
            ))} */}
               <TouchableOpacity
          style={styles.showListButton}
          onPress={() => {
            console.log('Show List clicked for:', bot.lists);
            // Optional: navigate to a new screen or show modal
          }}
        >
          <Text style={styles.showListButtonText}>Show List</Text>
        </TouchableOpacity>
          </View>
        ));
      }
      if (bot?.header) {
        switch (bot.header.type) {
          case 'image':
            header = (
              <Image
                source={{ uri: bot.header.mediaUrl }}
                style={styles.headerImage}
                resizeMode="cover"
              />
            );
            break;
    
          case 'text':
            header = (
              <Text style={styles.headerText}>
                {bot.header.text || bot.header.caption}
              </Text>
            );
            break;
    
          case 'document':
            header = (
              <TouchableOpacity
                style={styles.documentButton}
                onPress={() => Linking.openURL(bot.header.mediaUrl)}>
                <Text style={styles.documentText}>📄 Open Document</Text>
              </TouchableOpacity>
            );
            break;
    
          default:
            header = null;
        }
      }
    
      body = bot?.body || '';
      footer = bot?.footer || '';
    
      // 🎯 Chatbot buttons (type = reply)
      buttons = bot?.buttons?.map(btn => ({
        text: btn.reply?.title,
        id: btn.reply?.id,
      })) || [];
    
      messageText = [body, footer].filter(Boolean).join('\n\n');
    
    } else if (!item.IsIncoming && item.text) {
      // 📨 OUTGOING TEMPLATE / COMPONENT MESSAGE
      let parsedText = item.text;
    
      if (typeof item.text === 'string') {
        try {
          parsedText = JSON.parse(item.text);
        } catch (e) {
          parsedText = null;
        }
      }
    
      if (parsedText?.components) {
        parsedText.components.forEach(component => {
          switch (component.type) {
            case 'HEADER':
              header = component.text || '';
              break;
            case 'BODY':
              body = component.text || '';
              if (parsedText.variables) {
                parsedText.variables.forEach((val, idx) => {
                  const placeholder = `{{${idx + 1}}}`;
                  body = body.replace(placeholder, val);
                });
              }
              break;
            case 'FOOTER':
              footer = component.text || '';
              break;
            case 'BUTTONS':
              buttons = component.buttons || [];
              break;
          }
        });
    
        messageText = [header, body, footer].filter(Boolean).join('\n\n');
      } else {
        messageText =
          typeof item.text === 'string' ? item.text : 'Message not available';
      }
    
    } else {
      // 📩 INCOMING PLAIN TEXT (FROM USER)
      messageText = item.text ?? 'Message not available';
    }
    

  
    const messageTime = item.updatedAt ? formatTime(item.updatedAt) : '';

    return (
      <View
        style={[
          styles.messageContainer,
          item.IsIncoming ? styles.received : styles.sent,
        ]}>
          {header}
        {/* Message Text */}
        <Text style={styles.messageText}>{messageText}</Text>
        {lists}
        {/* Buttons (for templates or chatbot messages) */}
        {buttons.map((btn, index) => (
          <TouchableOpacity
            key={index}
            style={styles.messageText}
            onPress={() => btn.url && Linking.openURL(btn.url)}>
            <Text style={styles.buttonText}>{btn.text}</Text>
          </TouchableOpacity>
        ))}
  
        {/* Time and Status */}
        <View style={styles.statusContainer}>
          <Text style={styles.messageTime}>{messageTime}</Text>
          {!item.IsIncoming && getStatusIcon(item.status)}
        </View>
      </View>
    );
  };
  
  const  styles = StyleSheet.create({
    popupMenu: {
        position: 'absolute',
        bottom: 60,
        left: 10,
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        elevation: 5,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
      },
      previewContainer: {
        position: 'relative',
        margin: 10,
        alignSelf: 'flex-start',
      },
      
      previewImage: {
        width: 120,
        height: 120,
        borderRadius: 10,
      },
      
      closeButton: {
        position: 'absolute',
        top: -6,
        right: -6,
        backgroundColor: 'rgba(0,0,0,0.6)',
        borderRadius: 12,
        padding: 4,
      },
      popupItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 8,
      },
      
      popupText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#075E54',
      },
      plusButton: {
        padding: 2,
        marginBottom: 16,
      },
      showListButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 8,
        paddingVertical: 8,
        paddingHorizontal: 12,
        backgroundColor: '#34B7F1',
        borderRadius: 6,
        alignSelf: 'flex-start',
        borderTopWidth:1
      },
      showListButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
      },
      container: {
        flex: 1,
        backgroundColor: '#f0f0f0',
      },
      messageStatusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
      },
      tickIcon: {
        marginLeft: 4,
      },
      header: {
        height: 60,
        backgroundColor: '#075E54',
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        elevation: 4,
      },
      backButton: {
        marginRight: 8,
      },
      headerText: {
        color: '#fff',
        fontSize: 20,
        fontWeight: 'bold',
      },
      loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      },
      messageList: {
        flex: 1,
        paddingHorizontal: 10,
      },
      messageListContent: {
        flexGrow: 1,
        justifyContent: 'flex-end',
      },
      messageContainer: {
        maxWidth: '80%',
        marginVertical: 4,
        padding: 10,
        borderRadius: 8,
      },
      messageTime: {
        fontSize: 12,
        color: '#888',
        marginTop: 4,
        alignSelf: 'flex-end',
      },
    
      sent: {
        alignSelf: 'flex-end',
        backgroundColor: '#DCF8C6',
      },
      received: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
      },
      messageText: {
        fontSize: 16,
        color: '#333',
      },
      inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: '#fff',
        elevation: 4,
      },
      input: {
        flex: 1,
        height: 40,
        backgroundColor: '#eee',
        borderRadius: 20,
        paddingHorizontal: 15,
        fontSize: 16,
        marginRight: 8,
        paddingVertical: 5,
      },
      sendButton: {
        backgroundColor: '#075E54',
        padding: 10,
        borderRadius: 20,
        marginBottom: 16,
      },
      headerImage: {
        width: 200,
        height: 120,
        borderRadius: 10,
        marginBottom: 8,
        resizeMode:'center'
      },
      headerText: {
        fontWeight: 'bold',
        fontSize: 16,
        marginBottom: 4,
      },
      documentButton: {
        paddingVertical: 6,
        paddingHorizontal: 10,
        backgroundColor: '#f1f1f1',
        borderRadius: 6,
        marginBottom: 8,
      },
      documentText: {
        color: '#007AFF',
        textDecorationLine: 'underline',
      },
      button: {
        padding: 8,
        backgroundColor: '#E0F7FA',
        borderRadius: 6,
        marginTop: 4,
      },
      buttonText: {
        color: '#00796B',
        fontWeight: '600',
      },
  });
  export default RenderMessage;