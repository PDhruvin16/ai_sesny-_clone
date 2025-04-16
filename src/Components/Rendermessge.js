import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Linking,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const RenderMessage = ({item}) => {
  let header = '';
  let body = '';
  let footer = '';
  let messageText = 'Message not available';
  let buttons = [];
  let lists = [];
  if (item.type === 'audio') {
    console.log('Audio message URL:', item || 'No URL found');
  }
  const formatTime = timestamp => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'});
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
          <Icon name="done" size={16} color="#888" style={styles.statusIcon} />
        );
    }
  };

  // 🧠 MAIN SWITCH
  switch (true) {
    case !item.IsIncoming && !!item.chatBotMessage: {
      const bot = item.chatBotMessage;

      // HEADER
      switch (bot.header?.type) {
        case 'image': // Added case for image
          header = (
            <View style={styles.mediaContainer}>
              <Image
                source={{uri: bot.header.mediaUrl}}
                style={styles.media}
                resizeMode="cover"
              />
              {bot.header.caption && (
                <Text style={styles.captionText}>{bot.header.caption}</Text>
              )}
            </View>
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
        case 'video': // Added case for video
          header = (
            <View style={styles.mediaContainer}>
              <TouchableOpacity
                onPress={() => Linking.openURL(bot.header.mediaUrl)}>
                <Image
                  source={{uri: bot.header.thumbnailUrl || bot.header.mediaUrl}}
                  style={styles.media}
                  resizeMode="cover"
                />
                <View style={styles.playIconContainer}>
                  <Icon name="play-circle-outline" size={40} color="#fff" />
                </View>
              </TouchableOpacity>
              {bot.header.caption && (
                <Text style={styles.captionText}>{bot.header.caption}</Text>
              )}
            </View>
          );
          break;
        default:
          break;
      }

      body = bot?.body || '';
      footer = bot?.footer || '';
      messageText = [body].filter(Boolean).join('\n\n');

      if (bot?.buttons?.length > 0) {
        buttons = bot.buttons.map(btn => ({
          text: btn.reply?.title,
          id: btn.reply?.id,
        }));
      }

      if (bot?.lists?.length > 0) {
        lists = bot.lists.map((list, listIndex) => (
          <View key={`list-${listIndex}`} style={styles.listContainer}>
            <TouchableOpacity
              style={styles.showListButton}
              onPress={() => console.log('Show List clicked:', list)}>
              <Text style={styles.showListButtonText}>Show List</Text>
            </TouchableOpacity>
          </View>
        ));
      }

      break;
    }

    case !item.IsIncoming && !!item.text: {
      let parsedText =
        typeof item.text === 'string'
          ? (() => {
              try {
                return JSON.parse(item.text);
              } catch (e) {
                return null;
              }
            })()
          : item.text;

      if (parsedText?.components) {
        parsedText.components.forEach(component => {
          switch (component.type) {
            case 'HEADER':
              if (
                component.format === 'IMAGE' &&
                component.example?.header_handle?.length
              ) {
                header = (
                  <Image
                    source={{uri: component.example.header_handle[0]}}
                    style={styles.headerImage}
                    resizeMode="cover"
                  />
                );
              } else {
                // header = component.text || '';
                header = (
                  <Text style={styles.templateHeaderText}>
                    {component.text || ''}
                  </Text>
                );
              }
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
              // footer = component.text || '';
              footer = (
                <Text style={styles.templateFooterText}>
                  {typeof component.text === 'string' ? component.text : ''}
                </Text>
              );
              break;
            case 'BUTTONS':
              buttons = component.buttons || [];
              break;
          }
        });
        const textHeader = typeof header === 'string' ? header : '';
        messageText = [textHeader, body].filter(Boolean).join('\n\n');

      } 
    
      
      
      else {
        console.log('Incoming message 1234567:', item);
      //   messageText =
      //     typeof item.text === 'string' ? item.text : 'Message not available';
      // }
      messageText =
      typeof item.text === 'string' && item.text !== 'null'
        ? item.text
        : item.mediaUrl
        ? '' // If mediaUrl exists, leave messageText empty
        : 'Message not available';
    }

      break;
    }

    default: {
      // 📩 Incoming messages
      // console.log('Incoming message 1234567:', item);
      switch (item.type) {
        case 'image':
          if (item.mediaUrl) {
            header = (
              <View style={styles.mediaContainer}>
                <Image
                  source={{uri: item.mediaUrl}}
                  style={styles.media}
                  resizeMode="cover"
                />
              </View>
            );
          }
          break;

        case 'video':
          if (item.mediaUrl) {
            header = (
              <View style={styles.mediaContainer}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(item.mediaUrl)}>
                  <Image
                    source={{uri: item.thumbnailUrl || item.mediaUrl}}
                    style={styles.media}
                    resizeMode="cover"
                  />
                  <View style={styles.playIconContainer}>
                    <Icon name="play-circle-outline" size={40} color="#fff" />
                  </View>
                </TouchableOpacity>
              </View>
            );
          }
          break;
case 'audio':
         
            if (item.mediaUrl) {
              header = (
                <View style={styles.mediaContainer}>
                  <TouchableOpacity
                    onPress={() => Linking.openURL(item.mediaUrl)}
                    style={styles.audioButton}
                  >
                    <Icon name="play-circle-outline" size={40} color="#075E54" />
                    <Text style={styles.audioText}>
                      {item.fileName || 'Play Audio'}
                    </Text>
                  </TouchableOpacity>
                </View>
              );
          }
          break;
        case 'document':
          if (item.mediaUrl) {
            header = (
              <View style={styles.mediaContainer}>
                <TouchableOpacity
                  onPress={() => Linking.openURL(item.mediaUrl)}
                  style={styles.documentButton}>
                  <Icon name="insert-drive-file" size={40} color="#075E54" />
                  <Text style={styles.documentText}>
                    {item.fileName || 'View Document'}
                  </Text>
                </TouchableOpacity>
              </View>
            );
          }
          break;
       

     

        default:
          break;
      }

      messageText = item.text ?? (item.mediaUrl ? '' : 'Message not available');
    }
  }

  const messageTime = item.updatedAt ? formatTime(item.updatedAt) : '';
  console.log(item.type, 'item.type', item.type === 'audio');

  return (
    <View
      style={[
        styles.messageContainer,
        item.IsIncoming ? styles.received : styles.sent,
        (item.type === 'image' ||
          item.type === 'video' ||
          item.type === 'document' || item.type ==='audio' ) &&
          styles.noBackground,
      ]}>
      {item.type === 'image' ||
      item.type === 'video' ||
      item.type === 'document' || item.type === 'audio'? (
        <View style={styles.mediaWrapper}>
          {/* {console.log('item.type inside view', item, header,messageText)}
          {header} */}
          {console.log('Rendering header:', header)}
          {header}
          <View style={styles.mediaStatusContainer}>
            <Text style={styles.mediaTime}>{messageTime}</Text>
            {!item.IsIncoming && getStatusIcon(item.status)}
          </View>
        </View>
      ) : (
        <>
          {typeof header !== 'string' && header}
          {/* <Text style={styles.messageText}>{messageText}</Text> */}
          {/* <View style={styles.statusContainer}>
            <Text style={styles.messageTime}>{messageTime}</Text>
            {!item.IsIncoming && getStatusIcon(item.status)}
          </View> */}
           <View style={styles.messageContent}>
      {/* Message Text */}
      <Text style={styles.messageText}>{messageText}</Text>

      {/* Time and Status */}
      <View style={styles.timeContainer}>
        <Text style={styles.messageTime}>{messageTime}</Text>
        {!item.IsIncoming && getStatusIcon(item.status)}
      </View>
    </View>
        </>
      )}

      {lists}
      <Text style={styles.templateFooterText}>{footer}</Text>
      {buttons.map((btn, index) => (
        <TouchableOpacity
          key={index}
          style={styles.messageText}
          onPress={() => btn.url && Linking.openURL(btn.url)}>
          <Text style={styles.buttonText}>{btn.text}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  messageContent: {
    flexDirection: 'column', // Stack message text and time vertically
    position: 'relative', // Ensure time stays inside the box
  },
  timeContainer: {
    flexDirection: 'row', // Align time and status icon horizontally
    justifyContent: 'flex-end', // Align to the right
    alignItems: 'flex-end', // Center vertically
    // marginTop: 4,
    alignSelf:'flex-end' // Space between text and time
  },
  mediaWrapper: {
    position: 'relative',
  },
  audioButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  audioText: {
    marginLeft: 10,
    color: '#075E54',
    fontWeight: 'bold',
  },
  mediaStatusContainer: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    // backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  captionText: {
    marginTop: 8,
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
  },
  mediaTime: {
    fontSize: 11,
    color: '#fff',
    marginRight: 4,
  },

  messageContainer: {
    maxWidth: '80%',
    marginVertical: 4,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#DCF8C6', // Default background for messages
  },
  noBackground: {
    backgroundColor: 'transparent', // Remove background for media messages
    padding: 0, // Remove padding for media messages
  },
  received: {
    alignSelf: 'flex-start',
    backgroundColor: '#FFFFFF',
  },
  sent: {
    alignSelf: 'flex-end',
  },
  mediaContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    overflow: 'hidden',
    alignSelf: 'flex-start',
    marginBottom: 8,
  },
  media: {
    width: 200,
    height: 200,
  },
  playIconContainer: {
    position: 'absolute',
    top: '40%',
    left: '40%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  documentButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
  },
  documentText: {
    marginLeft: 10,
    color: '#007AFF',
    fontWeight: 'bold',
  },
  messageText: {
    fontSize: 16,
    color: '#333',
    marginTop: 8,
  },

  statusContainer: {
    position: 'absolute',
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    alignItems: 'center',
  },

  messageTime: {
    fontSize: 12,
    color: '#888',
    alignSelf: 'flex-end',
  },
  templateHeaderText: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#075E54', // WhatsApp-like green text for headers
    marginBottom: 4,
  },
  templateFooterText: {
    fontSize: 12,
    color: '#888', // Gray color for footer text
    marginTop: 8,
    fontStyle: 'italic',
  },
  headerImage: {
    width: 200,
    height: 120,
    borderRadius: 10,
    marginBottom: 8,
    resizeMode: 'cover',
  },
  button: {
    padding: 8,
    backgroundColor: '#E0F7FA', // Light blue for buttons
    borderRadius: 6,
    marginTop: 4,
  },
  buttonText: {
    color: '#00796B', // Dark green for button text
    fontWeight: '600',
  },
});

export default RenderMessage;
