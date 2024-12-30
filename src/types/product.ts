export interface ProductFormData {
  name: string;
  description: string;
  price: number;
  category: string;
  image_url: string | null;
  featured?: boolean;
}

export interface Product extends ProductFormData {
  id: string;
  created_at: string;
  featured: boolean;
}

export interface ProductFilters {
  categories: string[];
  priceRanges: string[];
}