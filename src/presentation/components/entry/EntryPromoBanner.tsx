import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, NativeSyntheticEvent, NativeScrollEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { WELCOME_TEXT } from '../../screens/welcome/WelcomeConstants';
import { useBrandColors } from '../../theme/BrandColorContext';

import { ENTRY_LAYOUT } from './EntryLayout';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32;

interface EntryPromoBannerProps {
  onBannerPress: (promoId: string) => void;
  autoScroll?: boolean;
}

export function EntryPromoBanner({ onBannerPress, autoScroll = false }: EntryPromoBannerProps) {
  const BRAND_COLORS = useBrandColors();
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeIndexRef = useRef(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!autoScroll || isUserInteracting) return;

    autoScrollTimerRef.current = setInterval(() => {
      const nextIndex = (activeIndexRef.current + 1) % WELCOME_TEXT.PROMOS.length;
      activeIndexRef.current = nextIndex;
      setActiveIndex(nextIndex);
      scrollRef.current?.scrollTo({
        x: nextIndex * BANNER_WIDTH,
        animated: true,
      });
    }, ENTRY_LAYOUT.PROMO_AUTO_SWIPE_INTERVAL);

    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [autoScroll, isUserInteracting]);

  const handlePageChange = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / BANNER_WIDTH);
    if (index !== activeIndexRef.current) {
      activeIndexRef.current = index;
      setActiveIndex(index);
    }
  };

  const handleScrollBeginDrag = () => {
    if (!autoScroll) return;
    setIsUserInteracting(true);
    if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleScrollEndDrag = () => {
    if (!autoScroll) return;
    resumeTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, ENTRY_LAYOUT.PROMO_RESUME_DELAY);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handlePageChange}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
        contentContainerStyle={styles.scrollContent}
      >
        {WELCOME_TEXT.PROMOS.map((promo) => (
          <TouchableOpacity
            key={promo.id}
            style={[styles.banner, { backgroundColor: promo.backgroundColor, width: BANNER_WIDTH }]}
            onPress={() => onBannerPress(promo.id)}
            activeOpacity={0.8}
          >
            <View style={styles.bannerContent}>
              <Text style={[styles.bannerTitle, { color: BRAND_COLORS.secondary.s5 }]}>{promo.title}</Text>
              <Text style={[styles.bannerSubtitle, { color: BRAND_COLORS.secondary.s3 }]}>{promo.subtitle}</Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

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
      ['rgba(255, 255, 255, 0.5)', '#140101ff']
    );

    return { backgroundColor };
  });

  return <Animated.View style={[styles.paginationDot, animatedStyle]} />;
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 230,
    position: 'relative',
  },
  scrollContent: {
    paddingRight: 0,
    paddingLeft: 0,
  },
  banner: {
    borderRadius: ENTRY_LAYOUT.PROMO_BANNER_BORDER_RADIUS,
    padding: ENTRY_LAYOUT.PROMO_BANNER_PADDING,
    minHeight: ENTRY_LAYOUT.PROMO_BANNER_MIN_HEIGHT,
    justifyContent: 'center',
  },
  bannerContent: {
    gap: ENTRY_LAYOUT.PROMO_BANNER_GAP,
  },
  bannerTitle: {
    fontSize: ENTRY_LAYOUT.PROMO_BANNER_TITLE_SIZE,
    fontFamily: 'Phudu-Bold',
  },
  bannerSubtitle: {
    fontSize: ENTRY_LAYOUT.PROMO_BANNER_SUBTITLE_SIZE,
    fontFamily: 'SpaceGrotesk-Medium',
    lineHeight: ENTRY_LAYOUT.PROMO_BANNER_SUBTITLE_LINE_HEIGHT,
  },
  paginationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: ENTRY_LAYOUT.PROMO_BANNER_MIN_HEIGHT,
    justifyContent: 'flex-end',
    paddingBottom: ENTRY_LAYOUT.PROMO_DOT_BOTTOM,
    pointerEvents: 'none',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: ENTRY_LAYOUT.PROMO_DOT_GAP,
  },
  paginationDot: {
    width: ENTRY_LAYOUT.PROMO_DOT_INACTIVE_WIDTH,
    height: ENTRY_LAYOUT.PROMO_DOT_HEIGHT,
    borderRadius: ENTRY_LAYOUT.PROMO_DOT_BORDER_RADIUS,
  },
});
