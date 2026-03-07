import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { Easing, interpolateColor, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated';
import { BRAND_COLORS } from '../../../theme/colors';
import { WELCOME_TEXT } from '../../welcome/WelcomeConstants';
import { HOME_LAYOUT } from '../HomeLayout';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 32;

export function AuthenticatedPromoBanner() {
  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isUserInteracting, setIsUserInteracting] = useState(false);

  const autoScrollTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isUserInteracting) return;

    autoScrollTimerRef.current = setInterval(() => {
      setActiveIndex((prev) => {
        const nextIndex = (prev + 1) % WELCOME_TEXT.PROMOS.length;
        scrollRef.current?.scrollTo({
          x: nextIndex * BANNER_WIDTH,
          animated: true,
        });
        return nextIndex;
      });
    }, HOME_LAYOUT.PROMO_AUTO_SWIPE_INTERVAL);

    return () => {
      if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    };
  }, [isUserInteracting]);

  const handleScroll = (event: any) => {
    const scrollPosition = event.nativeEvent.contentOffset.x;
    const index = Math.round(scrollPosition / BANNER_WIDTH);
    setActiveIndex(index);
  };

  const handleScrollBeginDrag = () => {
    setIsUserInteracting(true);
    if (autoScrollTimerRef.current) clearInterval(autoScrollTimerRef.current);
    if (resumeTimerRef.current) clearTimeout(resumeTimerRef.current);
  };

  const handleScrollEndDrag = () => {
    resumeTimerRef.current = setTimeout(() => {
      setIsUserInteracting(false);
    }, HOME_LAYOUT.PROMO_RESUME_DELAY);
  };

  const handleBannerPress = (promoId: string) => {
    console.log(`[AuthenticatedPromoBanner] Clicked: Promo ${promoId}`);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        onScrollBeginDrag={handleScrollBeginDrag}
        onScrollEndDrag={handleScrollEndDrag}
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
      ['rgba(22, 21, 21, 0.5)', BRAND_COLORS.background.default]
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
    borderRadius: 16,
    padding: 20,
    minHeight: 120,
    justifyContent: 'center',
  },
  bannerContent: {
    gap: 8,
  },
  bannerTitle: {
    fontSize: 18,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
  },
  bannerSubtitle: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.primary.xanhReu,
    lineHeight: 20,
  },

  paginationOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 120,
    justifyContent: 'flex-end',
    paddingBottom: HOME_LAYOUT.PROMO_DOT_BOTTOM,
    pointerEvents: 'none',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: HOME_LAYOUT.PROMO_DOT_GAP,
  },
  paginationDot: {
    width: HOME_LAYOUT.PROMO_DOT_INACTIVE_WIDTH,
    height: HOME_LAYOUT.PROMO_DOT_HEIGHT,
    borderRadius: HOME_LAYOUT.PROMO_DOT_BORDER_RADIUS,
  },
});