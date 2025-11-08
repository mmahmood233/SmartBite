/**
 * Database Types
 * 
 * Auto-generated types for Supabase database.
 * These types ensure type-safety when querying the database.
 * 
 * To regenerate these types:
 * 1. Run: npx supabase gen types typescript --project-id <project-ref> > src/types/database.ts
 * 2. Or manually update based on DATABASE_SCHEMA_V2.md
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string
          phone: string | null
          profile_image: string | null
          role: 'customer' | 'partner' | 'admin'
          is_active: boolean
          email_verified: boolean
          phone_verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name: string
          phone?: string | null
          profile_image?: string | null
          role?: 'customer' | 'partner' | 'admin'
          is_active?: boolean
          email_verified?: boolean
          phone_verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string
          phone?: string | null
          profile_image?: string | null
          role?: 'customer' | 'partner' | 'admin'
          is_active?: boolean
          email_verified?: boolean
          phone_verified?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      user_addresses: {
        Row: {
          id: string
          user_id: string
          label: string | null
          building: string | null
          road: string | null
          block: string | null
          area: string
          city: string
          postal_code: string | null
          latitude: number | null
          longitude: number | null
          contact_number: string | null
          notes: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          label?: string | null
          building?: string | null
          road?: string | null
          block?: string | null
          area: string
          city?: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          contact_number?: string | null
          notes?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          label?: string | null
          building?: string | null
          road?: string | null
          block?: string | null
          area?: string
          city?: string
          postal_code?: string | null
          latitude?: number | null
          longitude?: number | null
          contact_number?: string | null
          notes?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      restaurants: {
        Row: {
          id: string
          partner_id: string
          name: string
          category: string
          description: string | null
          logo: string | null
          banner_image: string | null
          address: string
          latitude: number | null
          longitude: number | null
          phone: string
          email: string | null
          rating: number
          total_reviews: number
          total_orders: number
          delivery_fee: number
          min_order: number
          avg_prep_time: string | null
          is_open: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          partner_id: string
          name: string
          category: string
          description?: string | null
          logo?: string | null
          banner_image?: string | null
          address: string
          latitude?: number | null
          longitude?: number | null
          phone: string
          email?: string | null
          rating?: number
          total_reviews?: number
          total_orders?: number
          delivery_fee?: number
          min_order?: number
          avg_prep_time?: string | null
          is_open?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          partner_id?: string
          name?: string
          category?: string
          description?: string | null
          logo?: string | null
          banner_image?: string | null
          address?: string
          latitude?: number | null
          longitude?: number | null
          phone?: string
          email?: string | null
          rating?: number
          total_reviews?: number
          total_orders?: number
          delivery_fee?: number
          min_order?: number
          avg_prep_time?: string | null
          is_open?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      dishes: {
        Row: {
          id: string
          restaurant_id: string
          category_id: string | null
          name: string
          description: string | null
          image: string | null
          price: number
          calories: number | null
          preparation_time: number | null
          is_vegetarian: boolean
          is_vegan: boolean
          is_spicy: boolean
          is_popular: boolean
          is_available: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          restaurant_id: string
          category_id?: string | null
          name: string
          description?: string | null
          image?: string | null
          price: number
          calories?: number | null
          preparation_time?: number | null
          is_vegetarian?: boolean
          is_vegan?: boolean
          is_spicy?: boolean
          is_popular?: boolean
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          restaurant_id?: string
          category_id?: string | null
          name?: string
          description?: string | null
          image?: string | null
          price?: number
          calories?: number | null
          preparation_time?: number | null
          is_vegetarian?: boolean
          is_vegan?: boolean
          is_spicy?: boolean
          is_popular?: boolean
          is_available?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          user_id: string
          restaurant_id: string
          delivery_address_id: string
          status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled'
          subtotal: number
          delivery_fee: number
          discount_amount: number
          total_amount: number
          payment_method: 'card' | 'benefitpay' | 'cash' | 'apple_pay'
          payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
          promo_code_id: string | null
          delivery_notes: string | null
          estimated_delivery_time: string | null
          actual_delivery_time: string | null
          rider_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number?: string
          user_id: string
          restaurant_id: string
          delivery_address_id: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled'
          subtotal: number
          delivery_fee?: number
          discount_amount?: number
          total_amount: number
          payment_method: 'card' | 'benefitpay' | 'cash' | 'apple_pay'
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          promo_code_id?: string | null
          delivery_notes?: string | null
          estimated_delivery_time?: string | null
          actual_delivery_time?: string | null
          rider_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          user_id?: string
          restaurant_id?: string
          delivery_address_id?: string
          status?: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled'
          subtotal?: number
          delivery_fee?: number
          discount_amount?: number
          total_amount?: number
          payment_method?: 'card' | 'benefitpay' | 'cash' | 'apple_pay'
          payment_status?: 'pending' | 'completed' | 'failed' | 'refunded'
          promo_code_id?: string | null
          delivery_notes?: string | null
          estimated_delivery_time?: string | null
          actual_delivery_time?: string | null
          rider_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          user_id: string
          restaurant_id: string
          order_id: string
          rating: number
          comment: string | null
          photo_url: string | null
          is_visible: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          restaurant_id: string
          order_id: string
          rating: number
          comment?: string | null
          photo_url?: string | null
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          restaurant_id?: string
          order_id?: string
          rating?: number
          comment?: string | null
          photo_url?: string | null
          is_visible?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      promo_codes: {
        Row: {
          id: string
          code: string
          title: string
          description: string | null
          type: 'percentage' | 'fixed' | 'free_delivery'
          discount_value: number
          min_order_amount: number
          max_usage: number | null
          used_count: number
          valid_from: string
          valid_until: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          code: string
          title: string
          description?: string | null
          type: 'percentage' | 'fixed' | 'free_delivery'
          discount_value: number
          min_order_amount?: number
          max_usage?: number | null
          used_count?: number
          valid_from: string
          valid_until: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          code?: string
          title?: string
          description?: string | null
          type?: 'percentage' | 'fixed' | 'free_delivery'
          discount_value?: number
          min_order_amount?: number
          max_usage?: number | null
          used_count?: number
          valid_from?: string
          valid_until?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      // Add more tables as needed...
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      user_role: 'customer' | 'partner' | 'admin'
      order_status: 'pending' | 'confirmed' | 'preparing' | 'ready_for_pickup' | 'out_for_delivery' | 'delivered' | 'cancelled'
      payment_method: 'card' | 'benefitpay' | 'cash' | 'apple_pay'
      payment_status: 'pending' | 'completed' | 'failed' | 'refunded'
      discount_type: 'percentage' | 'fixed' | 'free_delivery'
    }
  }
}
