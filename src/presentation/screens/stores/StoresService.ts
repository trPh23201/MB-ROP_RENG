import { StoreMenuService } from '../../../data/mockMenuStores';
import { Store as UIStore } from '../../../data/mockStores';
import { StoresSortMode } from './StoresEnums';

interface ApiStore {
  id: number;
  name: string;
  address: string | null;
  location: {
    type: string;
    coordinates: [number, number];
  };
  region?: {
    name: string;
  };
}

export class StoresUIService {

  static mapApiStoreToUIStore(apiStore: ApiStore, userLocation: { lat: number; lng: number } | null): UIStore {
    const storeLat = apiStore.location?.coordinates[1];
    const storeLng = apiStore.location?.coordinates[0];
    
    const distanceKm = userLocation ? this.calculateDistance(userLocation.lat, userLocation.lng, storeLat, storeLng) : 999;

    return {
      id: String(apiStore.id),
      name: apiStore.name,
      brandName: 'Rốp Rẻng',
      address: apiStore.address || 'Chưa có địa chỉ',
      imageUrl: 'https://via.placeholder.com/200x200/8B4513/FFF?text=Store',
      latitude: storeLat,
      longitude: storeLng,
      distanceKm,
    };
  }

  static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371;
    const dLat = this.toRad(lat2 - lat1);
    const dLng = this.toRad(lng2 - lng1);
    
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRad(lat1)) *
        Math.cos(this.toRad(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private static toRad(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  static sortStores(stores: UIStore[], mode: StoresSortMode): UIStore[] {
    switch (mode) {
      case StoresSortMode.NEAREST:
        return [...stores].sort((a, b) => a.distanceKm - b.distanceKm);

      case StoresSortMode.ALPHABETICAL:
        return [...stores].sort((a, b) => a.name.localeCompare(b.name));

      default:
        return stores;
    }
  }

  static getNearestStore(stores: UIStore[]): UIStore | null {
    if (stores.length === 0) return null;
    return this.sortStores(stores, StoresSortMode.NEAREST)[0];
  }

  static getOtherStores(stores: UIStore[]): UIStore[] {
    const sorted = this.sortStores(stores, StoresSortMode.NEAREST);
    return sorted.slice(1);
  }

  static formatDistance(distanceKm: number): string {
    return distanceKm.toFixed(2);
  }

  static filterStores(stores: UIStore[], query: string): UIStore[] {
    if (!query) return stores;

    const lowerQuery = query.toLowerCase();
    return stores.filter(
      (store) =>
        store.name.toLowerCase().includes(lowerQuery) ||
        store.address.toLowerCase().includes(lowerQuery)
    );
  }

  static filterStoresByProduct(stores: UIStore[], productId: string): UIStore[] {
    const storeIds = StoreMenuService.getStoresWithProduct(productId);
    return stores.filter((store) => storeIds.includes(store.id));
  }

  static getAvailableStoresForProduct(allStores: UIStore[], productId: string): UIStore[] {
    const validStoreIds = StoreMenuService.getStoresWithProduct(productId);
    return allStores.filter(store => validStoreIds.includes(store.id));
  }
}