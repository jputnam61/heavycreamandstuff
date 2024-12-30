export type Database = {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          image_url: string | null
          category: string
          created_at: string
        }
        Insert: Omit<Products['Row'], 'id' | 'created_at'>
        Update: Partial<Products['Insert']>
      }
      recipes: {
        Row: {
          id: string
          title: string
          description: string | null
          content: string | null
          image_url: string | null
          pdf_url: string | null
          created_at: string
        }
        Insert: Omit<Recipes['Row'], 'id' | 'created_at'>
        Update: Partial<Recipes['Insert']>
      }
      user_profiles: {
        Row: {
          id: string
          full_name: string | null
          is_admin: boolean
          created_at: string
        }
        Insert: Omit<UserProfiles['Row'], 'created_at'>
        Update: Partial<Omit<UserProfiles['Row'], 'id'>>
      }
    }
  }
}