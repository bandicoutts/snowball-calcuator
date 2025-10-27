export type Database = {
  public: {
    Tables: {
      debts: {
        Row: {
          id: string
          user_id: string
          name: string
          balance: number
          minimum_payment: number
          apr: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          balance: number
          minimum_payment: number
          apr: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          balance?: number
          minimum_payment?: number
          apr?: number
          created_at?: string
          updated_at?: string
        }
      }
      user_settings: {
        Row: {
          id: string
          user_id: string
          extra_payment: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          extra_payment?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          extra_payment?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
