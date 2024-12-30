export interface Recipe {
  id: string;
  title: string;
  description?: string;
  content?: string;
  image_url?: string;
  pdf_url?: string;
  is_premium: boolean;
  price?: number;
  created_at: string;
  category: string;
  prep_time_mins?: number;
  cook_time_mins?: number;
  servings?: number;
}

export interface RecipeCategory {
  id: string;
  name: string;
  description: string;
}