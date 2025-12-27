/**
 * User Management Screen (CRM)
 * Admin can view, filter, and manage all users
 */

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  ActivityIndicator,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { Feather as Icon } from '@expo/vector-icons';
import { PartnerColors, PartnerSpacing, PartnerTypography } from '../../constants/partnerTheme';
import { supabase } from '../../lib/supabase';
import { useLanguage } from '../../contexts/LanguageContext';

interface User {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  role: 'customer' | 'partner' | 'rider' | 'admin';
  created_at: string;
  updated_at: string;
}

type UserRole = 'all' | 'customer' | 'partner' | 'rider' | 'admin';

const UserManagementScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
  const { t } = useLanguage();
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState<UserRole>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newUserData, setNewUserData] = useState({
    email: '',
    password: '',
    full_name: '',
    phone: '',
    role: 'partner' as 'partner' | 'rider' | 'admin',
    restaurantId: '',
    createNewRestaurant: true,
    restaurantName: '',
  });
  const [creating, setCreating] = useState(false);
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loadingRestaurants, setLoadingRestaurants] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, selectedRole, searchQuery]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      
      setUsers(data || []);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      console.error('Error details:', JSON.stringify(error, null, 2));
      Alert.alert('Error', `Failed to load users: ${error.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Filter by role
    if (selectedRole !== 'all') {
      filtered = filtered.filter(user => user.role === selectedRole);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(user =>
        user.full_name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query)
      );
    }

    setFilteredUsers(filtered);
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return '#EF4444';
      case 'partner': return '#F59E0B';
      case 'rider': return '#3B82F6';
      case 'customer': return '#10B981';
      default: return '#6B7280';
    }
  };

  const getRoleBgColor = (role: string) => {
    switch (role) {
      case 'admin': return '#FEE2E2';
      case 'partner': return '#FEF3C7';
      case 'rider': return '#DBEAFE';
      case 'customer': return '#D1FAE5';
      default: return '#F3F4F6';
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return 'shield';
      case 'partner': return 'briefcase';
      case 'rider': return 'truck';
      case 'customer': return 'user';
      default: return 'user';
    }
  };

  const handleUserPress = (user: User) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleDeleteUser = async (userId: string) => {
    Alert.alert(
      'Delete User',
      'Are you sure you want to delete this user? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('users')
                .delete()
                .eq('id', userId);

              if (error) throw error;

              setModalVisible(false);
              fetchUsers();
              Alert.alert('Success', 'User deleted successfully');
            } catch (error) {
              console.error('Error deleting user:', error);
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ]
    );
  };

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ role: newRole, updated_at: new Date().toISOString() })
        .eq('id', userId);

      if (error) throw error;

      setModalVisible(false);
      fetchUsers();
      Alert.alert('Success', `User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
      Alert.alert('Error', 'Failed to update user role');
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const fetchRestaurants = async () => {
    setLoadingRestaurants(true);
    try {
      const { data, error } = await supabase
        .from('restaurants')
        .select('id, name, partner_id')
        .order('name');

      if (error) throw error;
      setRestaurants(data || []);
    } catch (error) {
      console.error('Error fetching restaurants:', error);
    } finally {
      setLoadingRestaurants(false);
    }
  };

  useEffect(() => {
    if (createModalVisible && newUserData.role === 'partner') {
      fetchRestaurants();
    }
  }, [createModalVisible, newUserData.role]);

  const handleCreateAccount = async () => {
    // Validation
    if (!newUserData.email || !newUserData.password || !newUserData.full_name) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    if (newUserData.password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    setCreating(true);
    
    // Save current admin session outside try block for access in catch
    const { data: { session: adminSession } } = await supabase.auth.getSession();
    
    try {
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: newUserData.email,
        password: newUserData.password,
        options: {
          data: {
            full_name: newUserData.full_name,
            role: newUserData.role,
          },
        },
      });

      if (authError) throw authError;

      if (authData.user) {
        // Check if user already exists (might be created by trigger)
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('id', authData.user.id)
          .single();

        // Only insert if user doesn't exist yet
        if (!existingUser) {
          const { error: userError } = await supabase
            .from('users')
            .insert([
              {
                id: authData.user.id,
                email: newUserData.email,
                full_name: newUserData.full_name,
                phone: newUserData.phone || null,
                role: newUserData.role,
              },
            ]);

          if (userError) throw userError;
        } else {
          // Update existing user with correct role and details
          const { error: updateError } = await supabase
            .from('users')
            .update({
              full_name: newUserData.full_name,
              phone: newUserData.phone || null,
              role: newUserData.role,
            })
            .eq('id', authData.user.id);

          if (updateError) throw updateError;
        }

        // If rider, create rider profile
        if (newUserData.role === 'rider') {
          const { error: riderError } = await supabase
            .from('riders')
            .insert([
              {
                user_id: authData.user.id,
                full_name: newUserData.full_name,
                phone: newUserData.phone || '',
                vehicle_type: 'motorcycle',
                status: 'offline',
              },
            ]);

          if (riderError) throw riderError;
        }

        // If partner, handle restaurant assignment
        if (newUserData.role === 'partner') {
          if (newUserData.createNewRestaurant) {
            // Create new restaurant
            const restaurantName = newUserData.restaurantName || `${newUserData.full_name}'s Restaurant`;
            const { error: restaurantError } = await supabase
              .from('restaurants')
              .insert([
                {
                  partner_id: authData.user.id,
                  name: restaurantName,
                  email: newUserData.email,
                  phone: newUserData.phone || '',
                  address: '',
                  is_active: true,
                  status: 'closed',
                },
              ]);

            if (restaurantError) throw restaurantError;
          } else if (newUserData.restaurantId) {
            // Assign existing restaurant to partner
            const { error: restaurantError } = await supabase
              .from('restaurants')
              .update({ partner_id: authData.user.id })
              .eq('id', newUserData.restaurantId);

            if (restaurantError) throw restaurantError;
          }
        }

        // Restore admin session after all database operations
        if (adminSession) {
          await supabase.auth.setSession({
            access_token: adminSession.access_token,
            refresh_token: adminSession.refresh_token,
          });
        }

        const roleLabel = newUserData.role === 'partner' ? 'Partner' : newUserData.role === 'rider' ? 'Rider' : 'Admin';
        Alert.alert('Success', `${roleLabel} account created successfully!`);
        setCreateModalVisible(false);
        setNewUserData({
          email: '',
          password: '',
          full_name: '',
          phone: '',
          role: 'partner',
          restaurantId: '',
          createNewRestaurant: true,
          restaurantName: '',
        });
        fetchUsers();
      }
    } catch (error: any) {
      console.error('Error creating account:', error);
      Alert.alert('Error', error.message || 'Failed to create account');
      
      // Restore admin session even on error
      if (adminSession) {
        await supabase.auth.setSession({
          access_token: adminSession.access_token,
          refresh_token: adminSession.refresh_token,
        });
      }
    } finally {
      setCreating(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={PartnerColors.primary} />
        <Text style={styles.loadingText}>Loading users...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={PartnerColors.light.text.primary} />
        </TouchableOpacity>
        <View style={styles.headerCenter}>
          <Text style={styles.headerTitle}>{t('admin.userManagement')}</Text>
          <Text style={styles.headerSubtitle}>{filteredUsers.length} {t('admin.users').toLowerCase()}</Text>
        </View>
        <TouchableOpacity onPress={fetchUsers} style={styles.refreshButton}>
          <Icon name="refresh-cw" size={20} color={PartnerColors.primary} />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Icon name="search" size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder={t('admin.searchUsers')}
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholderTextColor="#9CA3AF"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Icon name="x" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Role Filter */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        style={styles.filterScrollView}
        contentContainerStyle={styles.filterContainer}
      >
        {(['all', 'customer', 'partner', 'rider', 'admin'] as UserRole[]).map((role) => (
          <TouchableOpacity
            key={role}
            style={[
              styles.filterChip,
              selectedRole === role && styles.filterChipActive,
            ]}
            onPress={() => setSelectedRole(role)}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.filterChipText,
                selectedRole === role && styles.filterChipTextActive,
              ]}
            >
              {role === 'all' ? t('admin.allUsers') : role === 'customer' ? t('admin.customers') : role === 'rider' ? t('admin.riders') : role === 'partner' ? t('admin.partner') : t('admin.admin')}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Users List */}
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredUsers.length === 0 ? (
          <View style={styles.emptyState}>
            <Icon name="users" size={64} color="#D1D5DB" />
            <Text style={styles.emptyStateTitle}>No users found</Text>
            <Text style={styles.emptyStateText}>
              {searchQuery ? 'Try adjusting your search' : 'No users match the selected filter'}
            </Text>
          </View>
        ) : (
          <View style={styles.usersList}>
            {filteredUsers.map((user) => (
              <TouchableOpacity
                key={user.id}
                style={styles.userCard}
                onPress={() => handleUserPress(user)}
                activeOpacity={0.7}
              >
                <View style={styles.userAvatar}>
                  <Icon name="user" size={24} color={PartnerColors.primary} />
                </View>
                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.full_name || 'No Name'}</Text>
                  <Text style={styles.userEmail}>{user.email}</Text>
                  {user.phone && (
                    <Text style={styles.userPhone}>📱 {user.phone}</Text>
                  )}
                  <Text style={styles.userDate}>Joined {formatDate(user.created_at)}</Text>
                </View>
                <View style={styles.userMeta}>
                  <View style={[styles.roleBadge, { backgroundColor: getRoleBgColor(user.role) }]}>
                    <Icon name={getRoleIcon(user.role)} size={12} color={getRoleColor(user.role)} />
                    <Text style={[styles.roleText, { color: getRoleColor(user.role) }]}>
                      {user.role}
                    </Text>
                  </View>
                  <Icon name="chevron-right" size={20} color="#D1D5DB" />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setCreateModalVisible(true)}
        activeOpacity={0.8}
      >
        <Icon name="plus" size={24} color="#FFFFFF" />
      </TouchableOpacity>

      {/* User Details Modal */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>User Details</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Icon name="x" size={24} color={PartnerColors.light.text.primary} />
              </TouchableOpacity>
            </View>

            {selectedUser && (
              <ScrollView style={styles.modalBody}>
                <View style={styles.modalUserAvatar}>
                  <Icon name="user" size={48} color={PartnerColors.primary} />
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Name</Text>
                  <Text style={styles.detailValue}>{selectedUser.full_name || 'N/A'}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Email</Text>
                  <Text style={styles.detailValue}>{selectedUser.email}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Phone</Text>
                  <Text style={styles.detailValue}>{selectedUser.phone || 'N/A'}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Role</Text>
                  <View style={[styles.roleBadge, { backgroundColor: getRoleBgColor(selectedUser.role) }]}>
                    <Icon name={getRoleIcon(selectedUser.role)} size={12} color={getRoleColor(selectedUser.role)} />
                    <Text style={[styles.roleText, { color: getRoleColor(selectedUser.role) }]}>
                      {selectedUser.role}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>User ID</Text>
                  <Text style={styles.detailValueSmall}>{selectedUser.id}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Joined</Text>
                  <Text style={styles.detailValue}>{formatDate(selectedUser.created_at)}</Text>
                </View>

                <View style={styles.detailRow}>
                  <Text style={styles.detailLabel}>Last Updated</Text>
                  <Text style={styles.detailValue}>{formatDate(selectedUser.updated_at)}</Text>
                </View>

                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteUser(selectedUser.id)}
                  activeOpacity={0.7}
                >
                  <Icon name="trash-2" size={18} color="#FFFFFF" />
                  <Text style={styles.deleteButtonText}>Delete User</Text>
                </TouchableOpacity>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>

      {/* Create Account Modal */}
      <Modal
        visible={createModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setCreateModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Create New Account</Text>
              <TouchableOpacity onPress={() => setCreateModalVisible(false)}>
                <Icon name="x" size={24} color={PartnerColors.light.text.primary} />
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.modalBody}>
              {/* Role Selection */}
              <Text style={styles.inputLabel}>Account Type *</Text>
              <View style={styles.roleSelector}>
                <TouchableOpacity
                  style={[
                    styles.roleSelectorButton,
                    newUserData.role === 'partner' && styles.roleSelectorButtonActive,
                  ]}
                  onPress={() => setNewUserData({ ...newUserData, role: 'partner' })}
                >
                  <Icon name="briefcase" size={20} color={newUserData.role === 'partner' ? PartnerColors.primary : '#6B7280'} />
                  <Text style={[
                    styles.roleSelectorText,
                    newUserData.role === 'partner' && styles.roleSelectorTextActive,
                  ]}>Partner</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleSelectorButton,
                    newUserData.role === 'rider' && styles.roleSelectorButtonActive,
                  ]}
                  onPress={() => setNewUserData({ ...newUserData, role: 'rider' })}
                >
                  <Icon name="truck" size={20} color={newUserData.role === 'rider' ? PartnerColors.primary : '#6B7280'} />
                  <Text style={[
                    styles.roleSelectorText,
                    newUserData.role === 'rider' && styles.roleSelectorTextActive,
                  ]}>Rider</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.roleSelectorButton,
                    newUserData.role === 'admin' && styles.roleSelectorButtonActive,
                  ]}
                  onPress={() => setNewUserData({ ...newUserData, role: 'admin' })}
                >
                  <Icon name="shield" size={20} color={newUserData.role === 'admin' ? PartnerColors.primary : '#6B7280'} />
                  <Text style={[
                    styles.roleSelectorText,
                    newUserData.role === 'admin' && styles.roleSelectorTextActive,
                  ]}>Admin</Text>
                </TouchableOpacity>
              </View>

              {/* Full Name */}
              <Text style={styles.inputLabel}>Full Name *</Text>
              <TextInput
                style={styles.input}
                value={newUserData.full_name}
                onChangeText={(text) => setNewUserData({ ...newUserData, full_name: text })}
                placeholder="Enter full name"
                placeholderTextColor="#9CA3AF"
              />

              {/* Email */}
              <Text style={styles.inputLabel}>Email *</Text>
              <TextInput
                style={styles.input}
                value={newUserData.email}
                onChangeText={(text) => setNewUserData({ ...newUserData, email: text })}
                placeholder="Enter email address"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />

              {/* Password */}
              <Text style={styles.inputLabel}>Password *</Text>
              <TextInput
                style={styles.input}
                value={newUserData.password}
                onChangeText={(text) => setNewUserData({ ...newUserData, password: text })}
                placeholder="Enter password (min 6 characters)"
                placeholderTextColor="#9CA3AF"
                secureTextEntry
              />

              {/* Phone */}
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={newUserData.phone}
                onChangeText={(text) => setNewUserData({ ...newUserData, phone: text })}
                placeholder="Enter phone number"
                placeholderTextColor="#9CA3AF"
                keyboardType="phone-pad"
              />

              {/* Restaurant Selection (Only for Partners) */}
              {newUserData.role === 'partner' && (
                <>
                  <Text style={styles.inputLabel}>Restaurant Assignment *</Text>
                  <View style={styles.roleSelector}>
                    <TouchableOpacity
                      style={[
                        styles.roleSelectorButton,
                        newUserData.createNewRestaurant && styles.roleSelectorButtonActive,
                      ]}
                      onPress={() => setNewUserData({ ...newUserData, createNewRestaurant: true, restaurantId: '' })}
                    >
                      <Icon name="plus-circle" size={18} color={newUserData.createNewRestaurant ? PartnerColors.primary : '#6B7280'} />
                      <Text style={[
                        styles.roleSelectorText,
                        newUserData.createNewRestaurant && styles.roleSelectorTextActive,
                      ]}>Create New</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.roleSelectorButton,
                        !newUserData.createNewRestaurant && styles.roleSelectorButtonActive,
                      ]}
                      onPress={() => setNewUserData({ ...newUserData, createNewRestaurant: false })}
                    >
                      <Icon name="list" size={18} color={!newUserData.createNewRestaurant ? PartnerColors.primary : '#6B7280'} />
                      <Text style={[
                        styles.roleSelectorText,
                        !newUserData.createNewRestaurant && styles.roleSelectorTextActive,
                      ]}>Select Existing</Text>
                    </TouchableOpacity>
                  </View>

                  {newUserData.createNewRestaurant ? (
                    <>
                      <Text style={styles.inputLabel}>Restaurant Name (Optional)</Text>
                      <TextInput
                        style={styles.input}
                        value={newUserData.restaurantName}
                        onChangeText={(text) => setNewUserData({ ...newUserData, restaurantName: text })}
                        placeholder={`Default: ${newUserData.full_name}'s Restaurant`}
                        placeholderTextColor="#9CA3AF"
                      />
                    </>
                  ) : (
                    <>
                      <Text style={styles.inputLabel}>Select Restaurant *</Text>
                      {loadingRestaurants ? (
                        <ActivityIndicator size="small" color={PartnerColors.primary} style={{ marginVertical: 16 }} />
                      ) : (
                        <ScrollView 
                          style={styles.restaurantList} 
                          contentContainerStyle={styles.restaurantListContent}
                          nestedScrollEnabled
                          showsVerticalScrollIndicator={true}
                        >
                          {restaurants.map((restaurant) => (
                            <TouchableOpacity
                              key={restaurant.id}
                              style={[
                                styles.restaurantItem,
                                newUserData.restaurantId === restaurant.id && styles.restaurantItemActive,
                              ]}
                              onPress={() => setNewUserData({ ...newUserData, restaurantId: restaurant.id })}
                            >
                              <Icon 
                                name={newUserData.restaurantId === restaurant.id ? "check-circle" : "circle"} 
                                size={20} 
                                color={newUserData.restaurantId === restaurant.id ? PartnerColors.primary : '#D1D5DB'} 
                              />
                              <View style={{ flex: 1 }}>
                                <Text style={[
                                  styles.restaurantItemText,
                                  newUserData.restaurantId === restaurant.id && styles.restaurantItemTextActive,
                                ]}>
                                  {restaurant.name}
                                </Text>
                                {restaurant.partner_id && (
                                  <Text style={styles.restaurantSubtext}>
                                    Already registered
                                  </Text>
                                )}
                              </View>
                            </TouchableOpacity>
                          ))}
                          {restaurants.length === 0 && (
                            <Text style={styles.emptyText}>No restaurants available.</Text>
                          )}
                        </ScrollView>
                      )}
                    </>
                  )}
                </>
              )}

              {/* Create Button */}
              <TouchableOpacity
                style={[styles.createButton, creating && styles.createButtonDisabled]}
                onPress={handleCreateAccount}
                disabled={creating}
                activeOpacity={0.8}
              >
                {creating ? (
                  <ActivityIndicator size="small" color="#FFFFFF" />
                ) : (
                  <>
                    <Icon name="user-plus" size={18} color="#FFFFFF" />
                    <Text style={styles.createButtonText}>Create Account</Text>
                  </>
                )}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: PartnerSpacing.xl,
    paddingTop: Platform.OS === 'ios' ? 50 : PartnerSpacing.lg,
    paddingBottom: PartnerSpacing.lg,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: PartnerColors.light.borderLight,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: PartnerColors.light.text.primary,
  },
  headerSubtitle: {
    fontSize: 13,
    color: PartnerColors.light.text.secondary,
    marginTop: 2,
  },
  refreshButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchSection: {
    paddingHorizontal: PartnerSpacing.xl,
    paddingVertical: PartnerSpacing.md,
    backgroundColor: '#FFFFFF',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 48,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: PartnerColors.light.text.primary,
  },
  filterScrollView: {
    backgroundColor: '#FFFFFF',
    maxHeight: 70,
  },
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: PartnerSpacing.xl,
    paddingTop: 16,
    paddingBottom: 16,
    gap: 12,
    alignItems: 'center',
  },
  filterChip: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 24,
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
    borderColor: 'transparent',
    alignSelf: 'flex-start',
  },
  filterChipActive: {
    backgroundColor: '#FFFFFF',
    borderColor: PartnerColors.primary,
  },
  filterChipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#6B7280',
  },
  filterChipTextActive: {
    color: PartnerColors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingTop: 16,
  },
  usersList: {
    paddingHorizontal: PartnerSpacing.lg,
    paddingVertical: 0,
    gap: 12,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: PartnerSpacing.md,
    gap: 12,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  userAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E6F7F4',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
    gap: 2,
  },
  userName: {
    fontSize: 16,
    fontWeight: '600',
    color: PartnerColors.light.text.primary,
  },
  userEmail: {
    fontSize: 13,
    color: PartnerColors.light.text.secondary,
  },
  userPhone: {
    fontSize: 12,
    color: PartnerColors.light.text.tertiary,
  },
  userDate: {
    fontSize: 11,
    color: PartnerColors.light.text.tertiary,
    marginTop: 2,
  },
  userMeta: {
    alignItems: 'flex-end',
    gap: 8,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
  },
  roleText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: PartnerColors.light.text.primary,
    marginTop: 16,
  },
  emptyStateText: {
    fontSize: 14,
    color: PartnerColors.light.text.secondary,
    marginTop: 8,
    textAlign: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: PartnerColors.light.text.secondary,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: PartnerSpacing.xl,
    borderBottomWidth: 1,
    borderBottomColor: PartnerColors.light.borderLight,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: PartnerColors.light.text.primary,
  },
  modalBody: {
    padding: PartnerSpacing.xl,
  },
  modalUserAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#E6F7F4',
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginBottom: 24,
  },
  detailRow: {
    marginBottom: 20,
  },
  detailLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: PartnerColors.light.text.secondary,
    marginBottom: 6,
  },
  detailValue: {
    fontSize: 16,
    color: PartnerColors.light.text.primary,
  },
  detailValueSmall: {
    fontSize: 12,
    color: PartnerColors.light.text.tertiary,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  modalActions: {
    marginTop: 24,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: PartnerColors.light.borderLight,
  },
  actionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: PartnerColors.light.text.primary,
    marginBottom: 12,
  },
  roleButtons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  roleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: PartnerColors.light.borderLight,
    gap: 6,
  },
  roleButtonActive: {
    borderWidth: 2,
  },
  roleButtonText: {
    fontSize: 14,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: PartnerColors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.light.text.primary,
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: PartnerColors.light.text.primary,
    borderWidth: 1,
    borderColor: PartnerColors.light.borderLight,
  },
  roleSelector: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  roleSelectorButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: PartnerColors.light.borderLight,
  },
  roleSelectorButtonActive: {
    backgroundColor: `${PartnerColors.primary}15`,
    borderColor: PartnerColors.primary,
  },
  roleSelectorText: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: '#6B7280',
  },
  roleSelectorTextActive: {
    color: PartnerColors.primary,
  },
  createButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: PartnerColors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 24,
    marginBottom: 24,
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: '#FFFFFF',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#EF4444',
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 24,
  },
  deleteButtonText: {
    fontSize: 16,
    fontWeight: PartnerTypography.fontWeight.bold,
    color: '#FFFFFF',
  },
  restaurantList: {
    maxHeight: 200,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: PartnerColors.light.borderLight,
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  restaurantListContent: {
    flexGrow: 1,
  },
  restaurantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: PartnerColors.light.borderLight,
  },
  restaurantItemActive: {
    backgroundColor: `${PartnerColors.primary}10`,
  },
  restaurantItemText: {
    flex: 1,
    fontSize: 15,
    color: PartnerColors.light.text.primary,
  },
  restaurantItemTextActive: {
    fontWeight: PartnerTypography.fontWeight.semibold,
    color: PartnerColors.primary,
  },
  restaurantSubtext: {
    fontSize: 12,
    color: '#F59E0B',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: PartnerColors.light.text.secondary,
    textAlign: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
});

export default UserManagementScreen;
