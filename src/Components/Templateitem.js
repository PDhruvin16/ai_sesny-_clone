import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const TemplateItem = ({ item, onSelect }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={() => onSelect(item)}>
      {/* Template Name */}
      <Text style={styles.templateName}>{item.name}</Text>

      {/* Header (if present) */}
      {item.header ? <Text style={styles.header}>{item.header}</Text> : null}

      {/* Body */}
      <Text style={styles.body}>{item.body}</Text>

      {/* Footer (if present) */}
      {item.footer ? <Text style={styles.footer}>{item.footer}</Text> : null}

      {/* Buttons (if present) */}
      {item.buttons.length > 0 && (
        <View style={styles.buttonContainer}>
          {item.buttons.map((btn, index) => (
            <Text key={index.toString()} style={styles.buttonText}>• {btn.text}</Text>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    marginVertical: 8,
    marginHorizontal: 12,
    padding: 14,
    borderRadius: 10,
    borderColor: '#e0e0e0',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  templateName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#999',
    marginBottom: 6,
  },
  header: {
    fontSize: 15,
    fontWeight: '600',
    color: '#0a7cff',
    marginBottom: 8,
  },
  body: {
    fontSize: 16,
    color: '#000',
    marginBottom: 8,
    lineHeight: 22,
  },
  footer: {
    fontSize: 14,
    color: '#888',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  buttonContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 6,
  },
  buttonText: {
    fontSize: 15,
    color: '#0a7cff',
    marginTop: 4,
  },
});

export default TemplateItem;
