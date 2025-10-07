# 📢 Snackbar Pattern - Replace Alerts with Better UX

## Why Snackbars > Alerts

| Alert | Snackbar |
|-------|----------|
| ❌ Blocks entire screen | ✅ Non-intrusive |
| ❌ Requires tap to dismiss | ✅ Auto-dismisses |
| ❌ Interrupts flow | ✅ Smooth experience |
| ❌ Looks dated | ✅ Modern & professional |

---

## 🎯 The Pattern

### **Step 1: Add State (1 line)**
```typescript
const [snackbar, setSnackbar] = useState({ visible: false, message: '', type: 'success' as const });
```

### **Step 2: Helper Function (4 lines)**
```typescript
const showSnackbar = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success') => {
  setSnackbar({ visible: true, message, type });
};
```

### **Step 3: Replace Alert.alert (1 line)**
```typescript
// Before
Alert.alert('Success', '✅ Address saved successfully');

// After
showSnackbar('Address saved successfully', 'success');
```

### **Step 4: Add Snackbar Component (3 lines)**
```typescript
<Snackbar
  visible={snackbar.visible}
  message={snackbar.message}
  type={snackbar.type}
  onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
/>
```

---

## 📝 Complete Examples

### **AddAddressScreen**
```typescript
import Snackbar from '../components/Snackbar';
import LoadingSpinner from '../components/LoadingSpinner';

const AddAddressScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    visible: false, 
    message: '', 
    type: 'success' as const 
  });

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

  const handleSaveAddress = async () => {
    // Validation
    if (!validateRequired(building)) {
      showSnackbar('Please enter building/flat number', 'error');
      return;
    }
    if (!validateRequired(area)) {
      showSnackbar('Please enter area', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // await saveAddress(addressData);
      showSnackbar('Address saved successfully', 'success');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      showSnackbar('Failed to save address', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* Your content */}
      
      <LoadingSpinner visible={isLoading} message="Saving..." overlay />
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </KeyboardAvoidingView>
  );
};
```

### **EditAddressScreen**
```typescript
const EditAddressScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    visible: false, 
    message: '', 
    type: 'success' as const 
  });

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

  const handleUpdateAddress = async () => {
    setIsLoading(true);
    try {
      // await updateAddress(addressId, addressData);
      showSnackbar('Address updated successfully', 'success');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      showSnackbar('Failed to update address', 'error');
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
            showSnackbar('Address removed', 'success');
            setTimeout(() => navigation.goBack(), 1500);
          } catch (error) {
            showSnackbar('Failed to delete address', 'error');
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
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </KeyboardAvoidingView>
  );
};
```

### **AddPaymentMethodScreen**
```typescript
const AddPaymentMethodScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    visible: false, 
    message: '', 
    type: 'success' as const 
  });

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

  const handleSaveCard = async () => {
    // Validation
    if (!validateRequired(cardholderName)) {
      showSnackbar('Please enter cardholder name', 'error');
      return;
    }

    const cleanCardNumber = cardNumber.replace(/\s/g, '');
    if (cleanCardNumber.length < 13) {
      showSnackbar('Please enter a valid card number', 'error');
      return;
    }

    setIsLoading(true);
    try {
      // await savePaymentMethod(cardData);
      showSnackbar('Card added successfully', 'success');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      showSnackbar('Failed to add card', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* Your content */}
      
      <LoadingSpinner visible={isLoading} message="Adding card..." overlay />
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </KeyboardAvoidingView>
  );
};
```

### **ChangePasswordScreen**
```typescript
const ChangePasswordScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    visible: false, 
    message: '', 
    type: 'success' as const 
  });

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

  const handleUpdatePassword = async () => {
    if (!isValid) return;

    setIsLoading(true);
    try {
      // await updatePassword(currentPassword, newPassword);
      showSnackbar('Password updated successfully', 'success');
      setTimeout(() => navigation.goBack(), 1500);
    } catch (error) {
      showSnackbar('Current password is incorrect', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      {/* Your content */}
      
      <LoadingSpinner visible={isLoading} message="Updating..." overlay />
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </KeyboardAvoidingView>
  );
};
```

### **SavedAddressesScreen**
```typescript
const SavedAddressesScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    visible: false, 
    message: '', 
    type: 'success' as const 
  });

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

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
            showSnackbar('Address removed', 'success');
          } catch (error) {
            showSnackbar('Failed to remove address', 'error');
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
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </View>
  );
};
```

### **PaymentMethodsScreen**
```typescript
const PaymentMethodsScreen = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ 
    visible: false, 
    message: '', 
    type: 'success' as const 
  });

  const showSnackbar = (message: string, type: 'success' | 'error' = 'success') => {
    setSnackbar({ visible: true, message, type });
  };

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
            showSnackbar('Payment method removed', 'success');
          } catch (error) {
            showSnackbar('Failed to remove payment method', 'error');
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
      <Snackbar
        visible={snackbar.visible}
        message={snackbar.message}
        type={snackbar.type}
        onDismiss={() => setSnackbar({ ...snackbar, visible: false })}
      />
    </View>
  );
};
```

---

## 📋 Snackbar Messages

### **Success Messages (Green)**
```typescript
showSnackbar('Address saved successfully', 'success');
showSnackbar('Address updated successfully', 'success');
showSnackbar('Address removed', 'success');
showSnackbar('Card added successfully', 'success');
showSnackbar('Payment method removed', 'success');
showSnackbar('Password updated successfully', 'success');
showSnackbar('Profile updated', 'success');
showSnackbar('Changes saved', 'success');
```

### **Error Messages (Red)**
```typescript
showSnackbar('Failed to save address', 'error');
showSnackbar('Failed to update address', 'error');
showSnackbar('Failed to add card', 'error');
showSnackbar('Invalid card number', 'error');
showSnackbar('Current password is incorrect', 'error');
showSnackbar('Network error. Please try again', 'error');
showSnackbar('Please enter building/flat number', 'error');
showSnackbar('Please enter area', 'error');
```

### **Warning Messages (Yellow)**
```typescript
showSnackbar('Please fill all required fields', 'warning');
showSnackbar('Passwords do not match', 'warning');
showSnackbar('Card number is too short', 'warning');
```

### **Info Messages (Teal)**
```typescript
showSnackbar('Checking out...', 'info');
showSnackbar('Loading restaurants...', 'info');
showSnackbar('Updating profile...', 'info');
```

---

## 🎨 When to Use Alert vs Snackbar

### **Use Alert for:**
- ✅ Confirmations (Delete, Logout, etc.)
- ✅ Critical errors that need acknowledgment
- ✅ Destructive actions

### **Use Snackbar for:**
- ✅ Success messages
- ✅ Non-critical errors
- ✅ Validation errors
- ✅ Info messages
- ✅ Quick feedback

---

## 🔄 Migration Pattern

### **Before (Alert):**
```typescript
Alert.alert('Success', '✅ Address saved successfully', [
  { text: 'OK', onPress: () => navigation.goBack() }
]);
```

### **After (Snackbar):**
```typescript
showSnackbar('Address saved successfully', 'success');
setTimeout(() => navigation.goBack(), 1500);
```

---

## ✅ Implementation Checklist

### **Screens to Update:**
- [ ] AddAddressScreen
- [ ] EditAddressScreen
- [ ] SavedAddressesScreen
- [ ] AddPaymentMethodScreen
- [ ] PaymentMethodsScreen
- [ ] ChangePasswordScreen
- [ ] EditProfileScreen
- [ ] LoginScreen
- [ ] SignupScreen

### **For Each Screen:**
1. [ ] Import Snackbar component
2. [ ] Add snackbar state
3. [ ] Add showSnackbar helper
4. [ ] Replace success Alerts with showSnackbar
5. [ ] Replace validation Alerts with showSnackbar
6. [ ] Add Snackbar component to JSX
7. [ ] Test all flows

---

## 💡 Pro Tips

1. **Auto-navigate after success** - Use setTimeout for smooth UX
2. **Keep messages short** - "Address saved" not "Your address has been saved successfully"
3. **Remove emojis** - Snackbar has icons built-in
4. **Use appropriate types** - success/error/warning/info
5. **Don't overuse** - Only for non-critical feedback

---

## 📊 UX Impact

| Metric | Before | After |
|--------|--------|-------|
| **User Interruption** | High | Low |
| **Perceived Speed** | Slow | Fast |
| **Modern Feel** | ❌ | ✅ |
| **User Satisfaction** | 😐 | 😊 |

---

## 🚀 Quick Start

1. Copy the pattern from above
2. Add to each screen (5 minutes per screen)
3. Test all success/error flows
4. Enjoy better UX!

---

**Status:** Pattern Ready ✅  
**Time to Implement:** 5 minutes per screen ⏱️  
**UX Improvement:** Massive 🚀
