# ⏳ Loading Pattern - 3 Lines of Code

## Quick Implementation Guide

### **Step 1: Add State (1 line)**
```typescript
const [isLoading, setIsLoading] = useState(false);
```

### **Step 2: Wrap Async Function (2 lines)**
```typescript
const handleSave = async () => {
  setIsLoading(true);  // Line 1: Start loading
  try {
    await saveData();
    // Success handling
  } catch (error) {
    // Error handling
  } finally {
    setIsLoading(false);  // Line 2: Stop loading
  }
};
```

### **Step 3: Add Spinner (1 line)**
```typescript
<LoadingSpinner visible={isLoading} message="Saving..." overlay />
```

---

## 📝 Copy-Paste Examples

### **AddAddressScreen**
```typescript
import LoadingSpinner from '../components/LoadingSpinner';

const AddAddressScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveAddress = async () => {
    // Validation...
    
    setIsLoading(true);
    try {
      // await saveAddress(addressData);
      Alert.alert('Success', '✅ Address saved successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save address');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* Your content */}
      <LoadingSpinner visible={isLoading} message="Saving address..." overlay />
    </KeyboardAvoidingView>
  );
};
```

### **EditAddressScreen**
```typescript
const EditAddressScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdateAddress = async () => {
    setIsLoading(true);
    try {
      // await updateAddress(addressId, addressData);
      Alert.alert('Success', '✅ Address updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to update address');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAddress = () => {
    Alert.alert('Delete Address', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setIsLoading(true);
          try {
            // await deleteAddress(addressId);
            Alert.alert('Success', '🗑 Address removed', [
              { text: 'OK', onPress: () => navigation.goBack() }
            ]);
          } catch (error) {
            Alert.alert('Error', 'Failed to delete address');
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* Your content */}
      <LoadingSpinner visible={isLoading} message="Updating..." overlay />
    </KeyboardAvoidingView>
  );
};
```

### **AddPaymentMethodScreen**
```typescript
const AddPaymentMethodScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveCard = async () => {
    // Validation...
    
    setIsLoading(true);
    try {
      // await savePaymentMethod(cardData);
      Alert.alert('Success', '💳 Card added successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', 'Failed to add card');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* Your content */}
      <LoadingSpinner visible={isLoading} message="Adding card..." overlay />
    </KeyboardAvoidingView>
  );
};
```

### **ChangePasswordScreen**
```typescript
const ChangePasswordScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!isValid) return;
    
    setIsLoading(true);
    try {
      // await updatePassword(currentPassword, newPassword);
      Alert.alert('Success', '✅ Password updated successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } catch (error) {
      Alert.alert('Error', '⚠️ Current password is incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* Your content */}
      <LoadingSpinner visible={isLoading} message="Updating password..." overlay />
    </KeyboardAvoidingView>
  );
};
```

### **SavedAddressesScreen**
```typescript
const SavedAddressesScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeleteAddress = (id: string, title: string) => {
    Alert.alert('Delete Address', `Remove ${title}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setIsLoading(true);
          try {
            // await deleteAddress(id);
            setAddresses(addresses.filter(addr => addr.id !== id));
          } catch (error) {
            Alert.alert('Error', 'Failed to delete address');
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Your content */}
      <LoadingSpinner visible={isLoading} message="Deleting..." overlay />
    </View>
  );
};
```

### **PaymentMethodsScreen**
```typescript
const PaymentMethodsScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleDeletePayment = (id: string, label: string) => {
    Alert.alert('Remove Payment Method', `Remove ${label}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          setIsLoading(true);
          try {
            // await deletePaymentMethod(id);
            setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
          } catch (error) {
            Alert.alert('Error', 'Failed to remove payment method');
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Your content */}
      <LoadingSpinner visible={isLoading} message="Removing..." overlay />
    </View>
  );
};
```

### **ProfileScreen - Logout**
```typescript
const ProfileScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          setIsLoading(true);
          try {
            // await logout();
            // await AsyncStorage.clear();
            // navigation.navigate('Auth');
          } catch (error) {
            Alert.alert('Error', 'Failed to logout');
          } finally {
            setIsLoading(false);
          }
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      {/* Your content */}
      <LoadingSpinner visible={isLoading} message="Logging out..." overlay />
    </View>
  );
};
```

---

## 🎯 Loading Messages

| Screen | Message |
|--------|---------|
| **Add Address** | "Saving address..." |
| **Edit Address** | "Updating..." |
| **Delete Address** | "Deleting..." |
| **Add Payment** | "Adding card..." |
| **Remove Payment** | "Removing..." |
| **Change Password** | "Updating password..." |
| **Logout** | "Logging out..." |
| **Login** | "Signing in..." |
| **Signup** | "Creating account..." |
| **Place Order** | "Placing order..." |
| **Load Data** | "Loading..." |

---

## ✅ Checklist

### **Screens to Update:**
- [ ] AddAddressScreen
- [ ] EditAddressScreen
- [ ] SavedAddressesScreen
- [ ] AddPaymentMethodScreen
- [ ] PaymentMethodsScreen
- [ ] ChangePasswordScreen
- [ ] ProfileScreen (Logout)
- [ ] EditProfileScreen
- [ ] LoginScreen
- [ ] SignupScreen
- [ ] CheckoutScreen

---

## 🚀 Quick Implementation Steps

### **For Each Screen:**

1. **Import LoadingSpinner** (top of file)
```typescript
import LoadingSpinner from '../components/LoadingSpinner';
```

2. **Add state** (in component)
```typescript
const [isLoading, setIsLoading] = useState(false);
```

3. **Wrap async functions**
```typescript
setIsLoading(true);
try {
  // Your async code
} finally {
  setIsLoading(false);
}
```

4. **Add spinner** (before closing tag)
```typescript
<LoadingSpinner visible={isLoading} message="Loading..." overlay />
```

---

## 💡 Pro Tips

1. **Always use try/finally** - Ensures loading stops even on error
2. **Use overlay={true}** - Prevents user interaction during loading
3. **Keep messages short** - "Saving...", "Loading...", "Deleting..."
4. **Show spinner immediately** - Set loading before async call
5. **Hide spinner in finally** - Guarantees it stops

---

## 📊 Impact

| Before | After |
|--------|-------|
| ❌ No feedback | ✅ Clear loading state |
| ❌ Users confused | ✅ Users informed |
| ❌ Multiple taps | ✅ Blocked during loading |
| ❌ Looks broken | ✅ Looks professional |

---

**Status:** Pattern Ready ✅  
**Time to Implement:** 3 minutes per screen ⏱️  
**Quality Impact:** Massive 🚀
