// src/components/ErrorBoundary.js
import React from 'react';
import { View, Text, ScrollView, Platform } from 'react-native';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <ScrollView style={{ flex: 1, padding: 20, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: 'red', marginBottom: 10 }}>
            App crashed!
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Error:</Text>
          <Text style={{ fontFamily: Platform.OS === 'web' ? 'monospace' : 'System', backgroundColor: '#f0f0f0', padding: 10 }}>
            {this.state.error && this.state.error.toString()}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginTop: 10 }}>Component Stack:</Text>
          <Text style={{ fontFamily: Platform.OS === 'web' ? 'monospace' : 'System', backgroundColor: '#f0f0f0', padding: 10 }}>
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </Text>
        </ScrollView>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
