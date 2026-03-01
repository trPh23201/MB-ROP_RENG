import { useRouter } from 'expo-router';
import { Product } from '../../domain/entities/Product';
import { AuthActionService } from '../../domain/services/AuthActionService';
import { setPendingAction } from '../../state/slices/authSlice';
import { addToCart } from '../../state/slices/orderCartSlice';
import { useAppDispatch, useAppSelector } from '../hooks';
import { useAuthGuard } from './useAuthGuard';

export const useAddToCart = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const selectedStore = useAppSelector((state) => state.orderCart.selectedStore);

  return useAuthGuard(
    (product: Product) => {
      if (!selectedStore) {
        console.log(`[useAddToCart] No store selected. Redirecting for product: ${product.id}`);

        const pendingAction = AuthActionService.create('PURCHASE', {
          productId: product.id,
        });
        dispatch(setPendingAction(pendingAction));

        router.push({
          pathname: '/(tabs)/stores',
          params: { mode: 'select', productId: product.id },
        });
        return;
      }

      console.log(`[useAddToCart] Adding ${product.name} to cart`);
      dispatch(addToCart(product));
    },
    'PURCHASE',
    (product: Product) => ({ productId: product.id })
  );
};