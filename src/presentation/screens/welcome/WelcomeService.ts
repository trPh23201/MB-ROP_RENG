import { Category, Product } from '../../../data/mockProducts';
import { CategoryItem, ProductCardData } from '../../components/entry';

const CATEGORY_ICONS: Record<string, string> = {
  '1': 'cafe',
  '2': 'leaf-outline',
  '3': 'snow-outline',
};

export class WelcomeUIService {
  static groupProductsByCategory(
    categories: Category[],
    products: Product[]
  ): { category: Category; products: Product[] }[] {
    return categories.map((category) => ({
        category,
        products: products.filter((p) => p.categoryId === category.id),
    }));
  }

  static extractCategories(products: ProductCardData[]): CategoryItem[] {
    const map = new Map<string, CategoryItem>();
    products.forEach((p) => {
      if (!map.has(p.categoryId)) {
        map.set(p.categoryId, {
          id: p.categoryId,
          name: `Danh mục ${p.categoryId}`,
          icon: CATEGORY_ICONS[p.categoryId] || 'cafe-outline',
        });
      }
    });
    return Array.from(map.values());
  }

  static filterProducts<T extends ProductCardData>(products: T[], selectedCategoryId: string | null): T[] {
    if (!selectedCategoryId) return products;
    return products.filter((p) => p.categoryId === selectedCategoryId);
  }
}