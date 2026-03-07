import { useAuthGuard } from '@/src/utils/hooks/useAuthGuard';
import React, { useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BRAND_COLORS } from '../../../theme/colors';
import { WELCOME_TEXT } from '../WelcomeConstants';
import { WELCOME_LAYOUT } from '../WelcomeLayout';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32;

export function PromoBanner() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / BANNER_WIDTH);
    setActiveIndex(index);
  };

  const handleBannerPress = useAuthGuard(
    (promoId: string) => {
      console.log(`Clicked: Promo ${promoId}`);
      // TODO: Navigate to promo detail
    },
    'CLAIM_PROMO',
    (promoId: string) => ({ promoCode: promoId })
  );

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={styles.scrollContent}
      >
        {WELCOME_TEXT.PROMOS.map((promo) => (
          <TouchableOpacity
            key={promo.id}
            style={[styles.banner, { backgroundColor: promo.backgroundColor, width: BANNER_WIDTH }]}
            onPress={() => handleBannerPress(promo.id)}
            activeOpacity={0.8}
          >
            <View style={styles.bannerContent}>
              <Text style={styles.bannerTitle}>{promo.title}</Text>
              <Text style={styles.bannerSubtitle}>{promo.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Fixed Overlay with Pagination Dots */}
      <View style={styles.paginationOverlay}>
        <View style={styles.pagination}>
          {WELCOME_TEXT.PROMOS.map((_, index) => (
            <PaginationDot key={index} isActive={index === activeIndex} />
          ))}
        </View>
      </View>
    </View>
  );
}

function PaginationDot({ isActive }: { isActive: boolean }) {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withTiming(
      isActive ? 1 : 0,
      {
        duration: 200,
        easing: Easing.bezier(0.4, 0.0, 0.2, 1),
      }
    );
  }, [isActive, progress]);

  const animatedStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ['rgba(255, 255, 255, 0.5)', BRAND_COLORS.background.default]
    );

    return { backgroundColor };
  });

  return <Animated.View style={[styles.paginationDot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    position: 'relative',
  },
  scrollContent: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  banner: {
    borderRadius: WELCOME_LAYOUT.PROMO_BANNER_BORDER_RADIUS,
    padding: WELCOME_LAYOUT.PROMO_BANNER_PADDING,
    minHeight: WELCOME_LAYOUT.PROMO_BANNER_MIN_HEIGHT,
    justifyContent: 'center',
  },
  bannerContent: {
    gap: WELCOME_LAYOUT.PROMO_BANNER_GAP,
  },
  bannerTitle: {
    fontSize: WELCOME_LAYOUT.PROMO_BANNER_TITLE_SIZE,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.secondary.reuDam,
  },
  bannerSubtitle: {
    fontSize: WELCOME_LAYOUT.PROMO_BANNER_SUBTITLE_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.secondary.nauEspresso,
    lineHeight: WELCOME_LAYOUT.PROMO_BANNER_SUBTITLE_LINE_HEIGHT,
  },

  // Fixed overlay layer
  paginationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: WELCOME_LAYOUT.PROMO_BANNER_MIN_HEIGHT,
    justifyContent: 'flex-end',
    paddingBottom: WELCOME_LAYOUT.PROMO_DOT_BOTTOM,
    pointerEvents: 'none',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: WELCOME_LAYOUT.PROMO_DOT_GAP,
  },
  paginationDot: {
    width: WELCOME_LAYOUT.PROMO_DOT_INACTIVE_WIDTH,
    height: WELCOME_LAYOUT.PROMO_DOT_HEIGHT,
    borderRadius: WELCOME_LAYOUT.PROMO_DOT_BORDER_RADIUS,
  },
});