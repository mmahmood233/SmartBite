import React from 'react';
import { TextInput, StyleSheet, ViewStyle, TouchableOpacity, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { colors } from '../theme/colors';

interface SearchBarProps {
  placeholder?: string;
  style?: ViewStyle;
  onAIPress?: () => void;
  onFilterPress?: () => void;
  value?: string;
  onChangeText?: (text: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ 
  placeholder = 'Search restaurants or dishes', 
  style,
  onAIPress,
  onFilterPress,
  value,
  onChangeText,
  onFocus,
  onBlur,
}) => {
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
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        onBlur={onBlur}
      />
      {onAIPress && (
        <TouchableOpacity onPress={onAIPress} activeOpacity={0.7}>
          <View style={styles.aiButton}>
            <Icon name="zap" size={18} color={colors.primary} />
          </View>
        </TouchableOpacity>
      )}
      {onFilterPress && (
        <TouchableOpacity onPress={onFilterPress} activeOpacity={0.7}>
          <Icon name="sliders" size={20} color={colors.primary} style={styles.iconRight} />
        </TouchableOpacity>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    borderRadius: 12, // Reduced from 16 for professional look
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.06, // Slightly stronger shadow
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    borderWidth: 1.5, // Slightly thicker border
    borderColor: '#D8D8D8', // Darker border for definition
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
  aiButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#E8F5F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
});

export default SearchBar;
