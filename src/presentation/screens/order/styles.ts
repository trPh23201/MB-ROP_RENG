import { StyleSheet } from 'react-native';
import { ORDER_LAYOUT } from './OrderLayout';

export const orderStyles = StyleSheet.create({
  container: {
    flex: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: ORDER_LAYOUT.HEADER_PADDING_HORIZONTAL,
    paddingVertical: ORDER_LAYOUT.HEADER_PADDING_VERTICAL,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerTitle: {
    fontSize: ORDER_LAYOUT.HEADER_TITLE_SIZE,
    fontFamily: 'Phudu-Bold',
  },
  headerRight: {
    flexDirection: 'row',
    gap: 16,
  },
  promoSection: {
    marginBottom: 24,
  },
  promoHeader: {
    paddingHorizontal: ORDER_LAYOUT.PROMO_SECTION_PADDING,
    marginBottom: 12,
  },
  promoTitle: {
    fontSize: ORDER_LAYOUT.PROMO_TITLE_SIZE,
    fontFamily: 'Phudu-Bold',
    marginBottom: 8,
  },
  promoCountdown: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  promoCountdownLabel: {
    fontSize: ORDER_LAYOUT.PROMO_COUNTDOWN_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
  },
  promoCountdownValue: {
    fontSize: ORDER_LAYOUT.PROMO_COUNTDOWN_SIZE,
    fontFamily: 'SpaceMono-Bold',
  },
  promoScroll: {
    paddingHorizontal: ORDER_LAYOUT.PROMO_SECTION_PADDING,
    marginBottom: 5,
    marginTop: 5,
  },
  promoCard: {
    width: ORDER_LAYOUT.PROMO_CARD_WIDTH,
    marginRight: ORDER_LAYOUT.PROMO_CARD_GAP,
    borderRadius: 12,
    borderWidth: 0.05,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  promoImageContainer: {
    position: 'relative',
    aspectRatio: 1,
  },
  promoImage: {
    width: '100%',
    height: '100%',
  },
  discountBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  discountText: {
    fontSize: ORDER_LAYOUT.PROMO_DISCOUNT_BADGE_SIZE,
    fontFamily: 'Phudu-Bold',
  },
  percentBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: ORDER_LAYOUT.PROMO_PERCENT_BADGE_SIZE,
    height: ORDER_LAYOUT.PROMO_PERCENT_BADGE_SIZE,
    borderRadius: ORDER_LAYOUT.PROMO_PERCENT_BADGE_SIZE / 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  percentText: {
    fontSize: 11,
    fontFamily: 'Phudu-Bold',
  },
  promoInfo: {
    padding: 12,
  },
  promoProductName: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    marginBottom: 8,
    minHeight: 40,
  },
  promoPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  promoPrice: {
    fontSize: 16,
    fontFamily: 'Phudu-Bold',
  },
  promoOriginalPrice: {
    fontSize: 12,
    fontFamily: 'SpaceGrotesk-Medium',
    textDecorationLine: 'line-through',
  },
  chooseButton: {
    paddingVertical: 12,
    borderRadius: 24,
    alignItems: 'center',
  },
  chooseButtonText: {
    fontSize: 16,
    fontFamily: 'Phudu-Bold',
  },
  productSection: {
    paddingHorizontal: ORDER_LAYOUT.SECTION_PADDING,
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: ORDER_LAYOUT.SECTION_TITLE_SIZE,
    fontFamily: 'Phudu-Bold',
    marginBottom: 16,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'center',
  },
  productImage: {
    width: ORDER_LAYOUT.PRODUCT_IMAGE_SIZE,
    height: ORDER_LAYOUT.PRODUCT_IMAGE_SIZE,
    borderRadius: 8,
    borderWidth: 0.05,
    shadowColor: '#000',
    shadowOffset: { width: 2, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  productInfo: {
    flex: 1,
    marginLeft: 12,
  },
  productName: {
    fontSize: ORDER_LAYOUT.PRODUCT_NAME_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: ORDER_LAYOUT.PRODUCT_PRICE_SIZE,
    fontFamily: 'Phudu-Bold',
  },
  productAddButton: {
    width: ORDER_LAYOUT.ADD_BUTTON_SIZE,
    height: ORDER_LAYOUT.ADD_BUTTON_SIZE,
    borderRadius: ORDER_LAYOUT.ADD_BUTTON_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productAddText: {
  },
});