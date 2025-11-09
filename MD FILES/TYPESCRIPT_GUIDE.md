# SmartBite TypeScript Guide

Complete guide for working with TypeScript in the SmartBite project.

---

## 🎯 Why TypeScript?

### Benefits
- ✅ **Type Safety** - Catch errors at compile time, not runtime
- ✅ **IntelliSense** - Auto-complete for all props and functions
- ✅ **Self-Documenting** - Types serve as inline documentation
- ✅ **Refactoring** - Rename/change with confidence
- ✅ **Professional Standard** - Industry best practice

---

## 📁 Project Structure

```
SmartBite/
├── src/
│   ├── types/
│   │   └── index.ts              # All type definitions
│   ├── components/
│   │   ├── GradientButton.tsx
│   │   ├── Input.tsx
│   │   ├── Link.tsx
│   │   ├── AnimatedLogo.tsx
│   │   ├── SocialButton.tsx
│   │   └── index.ts
│   ├── screens/
│   │   ├── LoginScreen.tsx
│   │   └── SignupScreen.tsx
│   ├── navigation/
│   │   └── AuthNavigator.tsx
│   └── theme/
│       ├── colors.ts
│       ├── typography.ts
│       └── theme.ts
├── App.tsx
└── tsconfig.json
```

---

## 🔧 TypeScript Configuration

### tsconfig.json
```json
{
  "compilerOptions": {
    "strict": true,                    // Enable all strict checks
    "noUnusedLocals": true,           // Error on unused variables
    "noUnusedParameters": true,       // Error on unused parameters
    "noImplicitReturns": true,        // Error on missing returns
    "noFallthroughCasesInSwitch": true
  }
}
```

**Strict mode enabled** - Maximum type safety!

---

## 📦 Type Definitions

### Component Props

All component props are defined in `src/types/index.ts`:

```typescript
export interface GradientButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;              // Optional
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  gradientColors?: [string, string];
  accessibilityLabel?: string;
}
```

### Navigation Types

```typescript
export type AuthStackParamList = {
  Login: undefined;                // No params
  Signup: undefined;
};

// Usage in screens
type LoginScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'Login'
>;
```

### Theme Types

```typescript
export interface ColorPalette {
  primary: string;
  primaryDark: string;
  accent: string;
  // ... all colors
}

export interface DesignTokens {
  spacing: Spacing;
  borderRadius: BorderRadius;
  shadows: Shadows;
  animation: AnimationConfig;
}
```

---

## 🎨 Creating Components

### Basic Component

```typescript
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface MyComponentProps {
  title: string;
  count: number;
  onPress?: () => void;           // Optional
}

const MyComponent: React.FC<MyComponentProps> = ({ 
  title, 
  count, 
  onPress 
}) => {
  return (
    <View style={styles.container}>
      <Text>{title}: {count}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
});

export default MyComponent;
```

### Component with State

```typescript
import React, { useState } from 'react';
import { View, TextInput } from 'react-native';

interface FormProps {
  onSubmit: (email: string) => void;
}

const Form: React.FC<FormProps> = ({ onSubmit }) => {
  const [email, setEmail] = useState<string>('');
  const [isValid, setIsValid] = useState<boolean>(false);

  const handleSubmit = (): void => {
    if (isValid) {
      onSubmit(email);
    }
  };

  return (
    <View>
      <TextInput
        value={email}
        onChangeText={setEmail}
      />
    </View>
  );
};

export default Form;
```

---

## 🖥️ Creating Screens

### Screen with Navigation

```typescript
import React from 'react';
import { View, Text } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../types';

type MyScreenNavigationProp = NativeStackNavigationProp<
  AuthStackParamList,
  'MyScreen'
>;

interface MyScreenProps {
  navigation: MyScreenNavigationProp;
}

const MyScreen: React.FC<MyScreenProps> = ({ navigation }) => {
  const handleNavigate = (): void => {
    navigation.navigate('Login');
  };

  return (
    <View>
      <Text>My Screen</Text>
    </View>
  );
};

export default MyScreen;
```

---

## 🎯 Common Patterns

### Event Handlers

```typescript
// Button press
const handlePress = (): void => {
  console.log('Pressed');
};

// Text input change
const handleChange = (text: string): void => {
  setEmail(text);
};

// With event object
const handleSubmit = (event: GestureResponderEvent): void => {
  event.preventDefault();
  // ...
};
```

### Optional Props with Defaults

```typescript
interface ButtonProps {
  title: string;
  disabled?: boolean;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ 
  title, 
  disabled = false,      // Default value
  loading = false 
}) => {
  // ...
};
```

### Union Types

```typescript
type ButtonVariant = 'primary' | 'secondary' | 'outline';

interface ButtonProps {
  variant: ButtonVariant;
}

const Button: React.FC<ButtonProps> = ({ variant }) => {
  // variant can only be one of the three values
};
```

### Extending Existing Types

```typescript
import { TextInputProps } from 'react-native-paper';

export interface InputProps extends Omit<TextInputProps, 'theme'> {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  error?: boolean;
}
```

---

## 🔍 Type Checking

### Inline Type Assertions

```typescript
// Type assertion
const value = someValue as string;

// Non-null assertion (use sparingly!)
const element = document.getElementById('id')!;

// Better: Type guard
if (element !== null) {
  // TypeScript knows element is not null here
}
```

### Type Guards

```typescript
const isFormValid = (
  email: string, 
  password: string
): boolean => {
  return email.length > 0 && password.length > 0;
};

// Usage
if (isFormValid(email, password)) {
  handleSubmit();
}
```

---

## 🚨 Common Errors & Solutions

### Error: Type 'undefined' is not assignable

```typescript
// ❌ Wrong
const [user, setUser] = useState();

// ✅ Correct
const [user, setUser] = useState<User | null>(null);
```

### Error: Property does not exist on type

```typescript
// ❌ Wrong
const MyComponent = (props) => {
  return <Text>{props.title}</Text>;
};

// ✅ Correct
interface MyComponentProps {
  title: string;
}

const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  return <Text>{title}</Text>;
};
```

### Error: Argument of type 'string' is not assignable

```typescript
// ❌ Wrong
const handlePress = (id: number) => {
  console.log(id);
};

handlePress('123'); // Error!

// ✅ Correct
handlePress(123);
// or
handlePress(parseInt('123'));
```

---

## 📚 Best Practices

### 1. Always Define Prop Types

```typescript
// ✅ Good
interface ButtonProps {
  title: string;
  onPress: () => void;
}

const Button: React.FC<ButtonProps> = ({ title, onPress }) => {
  // ...
};

// ❌ Avoid
const Button = ({ title, onPress }: any) => {
  // ...
};
```

### 2. Use Const for Type Safety

```typescript
// ✅ Good
const colors = {
  primary: '#3BC8A4',
  accent: '#8E7CFF',
} as const;

// ❌ Avoid
const colors = {
  primary: '#3BC8A4',
  accent: '#8E7CFF',
};
```

### 3. Avoid 'any' Type

```typescript
// ❌ Avoid
const handleData = (data: any) => {
  // ...
};

// ✅ Good
interface UserData {
  id: string;
  name: string;
}

const handleData = (data: UserData) => {
  // ...
};
```

### 4. Use Enums for Constants

```typescript
enum OrderStatus {
  Pending = 'PENDING',
  Confirmed = 'CONFIRMED',
  Preparing = 'PREPARING',
  OutForDelivery = 'OUT_FOR_DELIVERY',
  Delivered = 'DELIVERED',
}

// Usage
const status: OrderStatus = OrderStatus.Confirmed;
```

### 5. Export Types with Components

```typescript
// MyComponent.tsx
export interface MyComponentProps {
  title: string;
}

export const MyComponent: React.FC<MyComponentProps> = ({ title }) => {
  // ...
};

// Usage in other files
import { MyComponent, MyComponentProps } from './MyComponent';
```

---

## 🎓 Advanced Patterns

### Generic Components

```typescript
interface ListProps<T> {
  items: T[];
  renderItem: (item: T) => React.ReactNode;
}

function List<T>({ items, renderItem }: ListProps<T>) {
  return (
    <View>
      {items.map((item, index) => (
        <View key={index}>{renderItem(item)}</View>
      ))}
    </View>
  );
}

// Usage
<List<User>
  items={users}
  renderItem={(user) => <Text>{user.name}</Text>}
/>
```

### Discriminated Unions

```typescript
type Result<T> = 
  | { success: true; data: T }
  | { success: false; error: string };

const handleResult = <T,>(result: Result<T>): void => {
  if (result.success) {
    console.log(result.data);  // TypeScript knows data exists
  } else {
    console.log(result.error); // TypeScript knows error exists
  }
};
```

---

## 🔧 IDE Setup

### VS Code Extensions

1. **ESLint** - Linting
2. **Prettier** - Code formatting
3. **TypeScript Hero** - Auto-import
4. **Error Lens** - Inline errors

### Auto-Import

TypeScript will auto-import types when you use them:

```typescript
// Just start typing
const button: GradientButtonProps = {
  // VS Code will suggest importing from '../types'
};
```

---

## 📊 Type Coverage

Check type coverage:

```bash
npx type-coverage --detail
```

**Goal**: 100% type coverage (no `any` types)

---

## 🚀 Migration Checklist

When adding new features:

- [ ] Define types in `src/types/index.ts`
- [ ] Use `.tsx` for components with JSX
- [ ] Use `.ts` for utilities/helpers
- [ ] Add prop interfaces for all components
- [ ] Type all function parameters and returns
- [ ] Avoid `any` type
- [ ] Export types with components
- [ ] Test with `npm run type-check`

---

## 📖 Resources

- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [React TypeScript Cheatsheet](https://react-typescript-cheatsheet.netlify.app/)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)

---

**Last Updated**: Full TypeScript Conversion Complete  
**Type Coverage**: 100% (strict mode enabled)
