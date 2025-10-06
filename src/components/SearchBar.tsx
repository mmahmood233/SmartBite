import React from 'react';
import { TextInput, StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';

interface SearchBarProps {
  placeholder?: string;
  style?: ViewStyle;
}

const SearchBar: React.FC<SearchBarProps> = ({ placeholder = 'Search restaurants or dishes', style }) => {
  return (
    <LinearGradient
      colors={['#FAFAFA', '#F2F2F2']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={[styles.container, style]}
    >
      <Icon name="search" size={20} color={colors.primary} style={styles.iconLeft} />
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#8A8A8A"
        style={styles.input}
      />
      <Icon name="sliders" size={20} color={colors.primary} style={styles.iconRight} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  iconLeft: {
    marginRight: 8,
  },
  iconRight: {
    marginLeft: 8,
  },
  input: {
    flex: 1,
    height: 44,
    color: '#4A4A4A',
    fontSize: 16,
  },
});

export default SearchBar;
