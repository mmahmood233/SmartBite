import React from 'react';
import { Text, StyleSheet, TextStyle } from 'react-native';

interface SectionHeaderProps {
  title: string;
  style?: TextStyle;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, style }) => {
  return <Text style={[styles.sectionTitle, style]}>{title}</Text>;
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1C1C1C',
    marginBottom: 12,
  },
});

export default SectionHeader;
