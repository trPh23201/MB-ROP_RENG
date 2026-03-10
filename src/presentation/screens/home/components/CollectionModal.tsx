import { BRAND_COLORS } from '@/src/presentation/theme/colors';
import BottomSheet, { BottomSheetBackdrop, BottomSheetView } from '@gorhom/bottom-sheet';
import { Image } from 'expo-image';
import React, { useCallback, useMemo, useRef } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Collection } from '../HomeInterfaces';

interface CollectionModalProps {
  collection: Collection | null;
  onClose: () => void;
}

export function CollectionModal({ collection, onClose }: CollectionModalProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPoints = useMemo(() => {
    return ['85%'];
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const renderBackdrop = useCallback(
    (props: any) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={-1}
        appearsOnIndex={0}
        opacity={0.5}
        pressBehavior="close"
      />
    ),
    []
  );

  if (!collection) return null;

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={0}
        snapPoints={snapPoints}
        enablePanDownToClose={true}
        enableDynamicSizing={false}
        backdropComponent={renderBackdrop}
        onChange={handleSheetChanges}
        backgroundStyle={styles.background}
        handleIndicatorStyle={styles.indicator}
      >
        <BottomSheetView style={styles.contentContainer}>
          <Image source={collection.bannerImage} style={styles.bannerImage} contentFit="cover" cachePolicy="disk" />
          
          <View style={styles.content}>
            <Text style={styles.title}>{collection.title}</Text>
            
            <View style={styles.promoCodeContainer}>
              <Text style={styles.promoCodeLabel}>Code: </Text>
              <Text style={styles.promoCodeValue}>COLLECTION2024</Text>
            </View>

            <Text style={styles.description}>{collection.description}</Text>
            
            {/* List sản phẩm trong collection (Placeholder) */}
            {/* Bạn có thể map collection.products vào đây */}
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
  },
  background: {
    backgroundColor: BRAND_COLORS.screenBg.warm,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  indicator: {
    backgroundColor: '#DDDDDD',
    width: 40,
  },
  contentContainer: {
    flex: 1,
    paddingBottom: 24,
  },
  bannerImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.secondary.nauEspresso,
    lineHeight: 24,
    marginBottom: 16,
  },
  promoCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: BRAND_COLORS.primary.beSua,
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    alignSelf: 'flex-start',
  },
  promoCodeLabel: {
    fontSize: 14,
    fontFamily: 'SpaceGrotesk-Medium',
    color: BRAND_COLORS.secondary.reuDam,
  },
  promoCodeValue: {
    fontSize: 16,
    fontFamily: 'Phudu-Bold',
    color: BRAND_COLORS.primary.xanhReu,
    marginLeft: 4,
  },
});