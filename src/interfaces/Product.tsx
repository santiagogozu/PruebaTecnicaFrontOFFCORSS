export interface Product {
  productId: string;
  productName: string;
  productTitle: string;
  brand: string;
  brandId: number;
  brandImageUrl: string;
  categoryId: string;
  categories: string[];
  description: string;
  releaseDate: string;
  Color: string[];
  Género: string[];
  linea: string[];
  items: { itemId: string; images?: { imageUrl: string }[] }[];
  itemsImages: string[];
  cuidados?: string[];
  origen?: string[];
  link: string;
}
