// src/components/Layout.js
import React from 'react';
import { View, StyleSheet, Platform, ScrollView } from 'react-native';

export default function Layout({ children, scrollable = true }) {
  const content = (
    <View style={styles.content}>
      {children}
    </View>
  );

  return (
    <View style={styles.container}>
      {scrollable ? (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {content}
        </ScrollView>
      ) : (
        content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    maxWidth: Platform.OS === 'web' ? 1200 : '100%',
    width: '100%',
    alignSelf: 'center',
    paddingHorizontal: Platform.OS === 'web' ? 20 : 0,
    paddingVertical: Platform.OS === 'web' ? 20 : 0,
  },
});
