
import { Product } from '@/src/data/mockProducts';
import { CartItem } from '@/src/presentation/screens/order/OrderInterfaces';
import { SQLiteDatabase } from 'expo-sqlite';

export interface CartDbItem {
  id: number;
  user_id: string;
  store_id: string;
  product_id: number;
  menu_item_id: number;
  quantity: number;
  created_at: number;
}

export class CartRepository {
  constructor(private readonly db: SQLiteDatabase) {}

  async addItem(userId: string, storeId: string, product: Product, quantity: number = 1): Promise<void> {
    const productIdNum = product.productId || parseInt(product.id) || 0;
    const existing = await this.db.getFirstAsync<CartDbItem>(
      'SELECT * FROM cart_items WHERE user_id = ? AND store_id = ? AND product_id = ?',
      [userId, storeId, productIdNum]
    );

    if (existing) {
      await this.db.runAsync(
        'UPDATE cart_items SET quantity = quantity + ? WHERE id = ?',
        [quantity, existing.id]
      );
    } else {
      await this.db.runAsync(
        'INSERT INTO cart_items (user_id, store_id, product_id, menu_item_id, quantity, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        [userId, storeId, productIdNum, product.menuItemId || 0, quantity, Date.now()]
      );
    }
  }

  async updateQuantity(userId: string, storeId: string, productId: string, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await this.removeItem(userId, storeId, productId);
      return;
    }

    await this.db.runAsync(
      'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND store_id = ? AND product_id = ?',
      [quantity, userId, storeId, parseInt(productId) || 0]
    );
  }

  async removeItem(userId: string, storeId: string, productId: string): Promise<void> {
    await this.db.runAsync(
      'DELETE FROM cart_items WHERE user_id = ? AND store_id = ? AND product_id = ?',
      [userId, storeId, parseInt(productId) || 0]
    );
  }

  async getCartItems(userId: string, storeId: string, productsMap: Map<string, Product>): Promise<CartItem[]> {
    const rows = await this.db.getAllAsync<CartDbItem>(
      'SELECT * FROM cart_items WHERE user_id = ? AND store_id = ? ORDER BY created_at DESC',
      [userId, storeId]
    );

    return rows
      .map((row) => {
        let product = productsMap.get(String(row.product_id));
        if (!product) return null;
        
        if (row.menu_item_id) {
            product = {
                ...product,
                menuItemId: row.menu_item_id || product.menuItemId,
                productId: row.product_id || product.productId
            };
        }

        return {
          product,
          quantity: row.quantity,
        };
      })
      .filter((item): item is CartItem => item !== null);
  }

  async getCartTotals(userId: string, storeId: string, productsMap: Map<string, Product>): Promise<{ totalItems: number; totalPrice: number }> {
    const items = await this.getCartItems(userId, storeId, productsMap);
    
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );

    return { totalItems, totalPrice };
  }

  async clearCart(userId: string, storeId: string): Promise<void> {
    await this.db.runAsync(
      'DELETE FROM cart_items WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );
  }

  async clearAllCartsForUser(userId: string): Promise<void> {
    await this.db.runAsync('DELETE FROM cart_items WHERE user_id = ?', [userId]);
  }

  async clearOtherStores(userId: string, currentStoreId: string): Promise<void> {
    await this.db.runAsync(
      'DELETE FROM cart_items WHERE user_id = ? AND store_id != ?',
      [userId, currentStoreId]
    );
  }

  async getCurrentStore(userId: string): Promise<string | null> {
    const row = await this.db.getFirstAsync<{ store_id: string }>(
      'SELECT store_id FROM cart_items WHERE user_id = ? LIMIT 1',
      [userId]
    );
    return row?.store_id || null;
  }

  async expireOldItems(maxAgeDays: number = 7): Promise<void> {
    const cutoffTime = Date.now() - maxAgeDays * 24 * 60 * 60 * 1000;
    await this.db.runAsync('DELETE FROM cart_items WHERE created_at < ?', [
      cutoffTime,
    ]);
  }
}