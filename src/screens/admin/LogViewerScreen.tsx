/**
 * Log Viewer Screen
 * 
 * View and manage application logs
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Share,
  Platform,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { logger } from '../../services/logger.service';

const LogViewerScreen = ({ navigation }: any) => {
  const [logs, setLogs] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      const recentLogs = await logger.getRecentLogs(500);
      setLogs(recentLogs);
    } catch (error: any) {
      console.error('Error loading logs:', error);
      setLogs('Error loading logs. Please try again.');
    } finally {
      setLoading(false);
    }
  };


  const handleExport = async () => {
    try {
      const exportPath = await logger.exportLogs();
      
      if (Platform.OS === 'ios' || Platform.OS === 'android') {
        await Share.share({
          message: 'Wajba App Logs',
          url: exportPath,
        });
      } else {
        Alert.alert('Success', `Logs exported to: ${exportPath}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to export logs');
    }
  };

  const handleClear = () => {
    Alert.alert(
      'Clear Logs',
      'Are you sure you want to clear all logs? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear',
          style: 'destructive',
          onPress: async () => {
            await logger.clearLogs();
            await loadLogs();
            Alert.alert('Success', 'Logs cleared');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Application Logs</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Action Buttons */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionButton} onPress={loadLogs}>
          <Icon name="refresh-cw" size={18} color={colors.primary} />
          <Text style={styles.actionButtonText}>Refresh</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleExport}>
          <Icon name="share" size={18} color={colors.primary} />
          <Text style={styles.actionButtonText}>Export</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton} onPress={handleClear}>
          <Icon name="trash-2" size={18} color="#EF4444" />
          <Text style={[styles.actionButtonText, { color: '#EF4444' }]}>Clear</Text>
        </TouchableOpacity>
      </View>

      {/* Logs Display */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading logs...</Text>
        </View>
      ) : (
        <ScrollView style={styles.logsContainer}>
          <View style={styles.logsContent}>
            {logs ? (
              <Text style={styles.logText}>{logs}</Text>
            ) : (
              <Text style={styles.emptyText}>No logs found</Text>
            )}
          </View>
        </ScrollView>
      )}

      {/* Log Count */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          {logs.split('\n').filter((line: string) => line.trim()).length} log entries
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 50 : 20,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 40,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    marginTop: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
  },
  logsContainer: {
    flex: 1,
  },
  logsContent: {
    padding: 16,
  },
  logText: {
    fontSize: 11,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    color: '#333',
    lineHeight: 18,
  },
  emptyText: {
    fontSize: 15,
    color: '#999',
    textAlign: 'center',
    marginTop: 40,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 15,
    color: '#666',
  },
  footer: {
    padding: 12,
    backgroundColor: '#FFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 13,
    color: '#666',
  },
});

export default LogViewerScreen;
