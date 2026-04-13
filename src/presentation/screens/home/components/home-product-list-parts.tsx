import React from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useBrandColors } from '../../../theme/BrandColorContext';

interface HomeListFooterProps {
  isLoadingMore: boolean;
  hasMore: boolean;
  productCount: number;
}

export const HomeListFooter = React.memo(function HomeListFooter({
  isLoadingMore,
  hasMore,
  productCount,
}: HomeListFooterProps) {
  const BRAND_COLORS = useBrandColors();

  if (isLoadingMore) {
    return (
      <View style={styles.loadingMore}>
        <ActivityIndicator size="small" color={BRAND_COLORS.primary.p3} />
        <Text style={[styles.loadingMoreText, { color: BRAND_COLORS.text.secondary }]}>Đang tải thêm...</Text>
      </View>
    );
  }

  if (!hasMore && productCount > 0) {
    return (
      <View style={styles.endList}>
        <Text style={[styles.endListText, { color: BRAND_COLORS.text.secondary }]}>
          Đã hiển thị tất cả sản phẩm
        </Text>
      </View>
    );
  }

  return <View style={{ height: 100 }} />;
});

interface HomeListEmptyProps {
  error: string | null;
  onRetry: () => void;
}

export const HomeListEmpty = React.memo(function HomeListEmpty({
  error,
  onRetry,
}: HomeListEmptyProps) {
  const BRAND_COLORS = useBrandColors();

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          {error.includes('404') ? 'Không tìm thấy cửa hàng ở khu vực này' : error}
        </Text>
        <TouchableOpacity
          style={[styles.retryButton, { backgroundColor: BRAND_COLORS.primary.p3 }]}
          onPress={onRetry}
        >
          <Text style={styles.retryText}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.emptyContainer}>
      <Text style={[styles.emptyText, { color: BRAND_COLORS.text.secondary }]}>Không có sản phẩm</Text>
    </View>
  );
});

const styles = StyleSheet.create({
  loadingMore: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    gap: 8,
  },
  loadingMoreText: { fontSize: 14, fontFamily: 'SpaceGrotesk-Regular' },
  endList: { paddingVertical: 20, alignItems: 'center' },
  endListText: { fontSize: 14, fontFamily: 'SpaceGrotesk-Regular' },
  errorContainer: { padding: 40, alignItems: 'center', gap: 12 },
  errorText: { fontSize: 14, fontFamily: 'SpaceGrotesk-Regular', color: '#FF3B30', textAlign: 'center' },
  retryButton: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 8 },
  retryText: { fontSize: 14, fontFamily: 'SpaceGrotesk-Bold', color: '#FFFFFF' },
  emptyContainer: { padding: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, fontFamily: 'SpaceGrotesk-Regular' },
});
