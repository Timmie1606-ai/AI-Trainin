export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          email: string
          display_name: string | null
          is_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          display_name?: string | null
          is_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          display_name?: string | null
          is_admin?: boolean
          updated_at?: string
        }
        Relationships: []
      }
      trainin_credentials: {
        Row: {
          id: string
          user_id: string
          encrypted_api_key: string
          encrypted_tenant_id: string
          api_key_iv: string
          tenant_id_iv: string
          is_verified: boolean
          last_verified_at: string | null
          trainin_account_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          encrypted_api_key: string
          encrypted_tenant_id: string
          api_key_iv: string
          tenant_id_iv: string
          is_verified?: boolean
          last_verified_at?: string | null
          trainin_account_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          encrypted_api_key?: string
          encrypted_tenant_id?: string
          api_key_iv?: string
          tenant_id_iv?: string
          is_verified?: boolean
          last_verified_at?: string | null
          trainin_account_name?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      conversations: {
        Row: {
          id: string
          user_id: string
          title: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          user_id: string
          role: string
          content: string
          tool_name: string | null
          tool_input: Json | null
          tool_result: Json | null
          input_tokens: number | null
          output_tokens: number | null
          created_at: string
        }
        Insert: {
          id?: string
          conversation_id: string
          user_id: string
          role: string
          content: string
          tool_name?: string | null
          tool_input?: Json | null
          tool_result?: Json | null
          input_tokens?: number | null
          output_tokens?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          conversation_id?: string
          user_id?: string
          role?: string
          content?: string
          tool_name?: string | null
          tool_input?: Json | null
          tool_result?: Json | null
          input_tokens?: number | null
          output_tokens?: number | null
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
