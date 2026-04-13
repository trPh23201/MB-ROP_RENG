import { Ionicons } from '@expo/vector-icons';
import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Dimensions, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { Order } from "../../../domain/entities/Order";
import { useAppSelector } from "../../../utils/hooks";
import { BaseAuthenticatedLayout } from "../../layouts/BaseAuthenticatedLayout";
import { useBrandColors } from '../../theme/BrandColorContext';
import { ITEMS_PER_PAGE, ORDER_HISTORY_STRINGS, STATUS_CHIPS } from "./OrderHistoryConstants";
import { OrderStatus } from "./OrderHistoryEnums";
import { StatusChipData } from "./OrderHistoryInterfaces";
import { OrderHistoryService } from "./OrderHistoryService";
import { SkeletonShimmerList } from "../../components/shared/skeleton-shimmer-list";
import { OrderHistoryItem } from "./components/OrderHistoryItem";
import { OrderStatusChip } from "./components/OrderStatusChip";

export default function OrderHistoryScreen() {
  const BRAND_COLORS = useBrandColors();
  const router = useRouter();
  const user = useAppSelector((state) => state.auth.user);
  const service = useMemo(() => new OrderHistoryService(), []);

  const [allOrders, setAllOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [page, setPage] = useState<number>(0);
  const [selectedStatuses, setSelectedStatuses] = useState<StatusChipData[]>(STATUS_CHIPS);

  const activeStatuses = useMemo(
    () =>
      selectedStatuses.filter((chip) => chip.isSelected && chip.status !== OrderStatus.ALL).map((chip) => chip.status),
    [selectedStatuses],
  );

  const filteredOrders = useMemo(() => {
    if (activeStatuses.length === 0) {
      return allOrders;
    }
    return allOrders.filter((order) => activeStatuses.includes(order.orderStatus as OrderStatus));
  }, [allOrders, activeStatuses]);

  const loadOrders = useCallback(
    async (pageNum: number, append: boolean = false) => {
      if (!user?.uuid) {
        return;
      }

      try {
        const result = await service.loadOrders(user.uuid, pageNum, ITEMS_PER_PAGE, undefined);

        setAllOrders((prev) => (append ? [...prev, ...result.orders] : result.orders));
        setHasMore(result.hasMore);
        setPage(pageNum);
      } catch (error) {
        // Error captured by Sentry
      } finally {
        setLoading(false);
        setRefreshing(false);
        setLoadingMore(false);
      }
    },
    [user?.uuid, service],
  );

  useEffect(() => {
    loadOrders(0);
  }, [loadOrders]);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    loadOrders(0);
  }, [loadOrders]);

  const handleLoadMore = useCallback(() => {
    if (!loadingMore && hasMore) {
      setLoadingMore(true);
      loadOrders(page + 1, true);
    }
  }, [loadingMore, hasMore, page, loadOrders]);

  const handleChipPress = useCallback((pressedStatus: OrderStatus) => {
    setSelectedStatuses((prev) => {
      if (pressedStatus === OrderStatus.ALL) {
        return prev.map((chip) => ({
          ...chip,
          isSelected: chip.status === OrderStatus.ALL,
        }));
      }

      const newChips = prev.map((chip) => {
        if (chip.status === OrderStatus.ALL) {
          return { ...chip, isSelected: false };
        }
        if (chip.status === pressedStatus) {
          return { ...chip, isSelected: !chip.isSelected };
        }
        return chip;
      });

      const anySelected = newChips.some((c) => c.isSelected && c.status !== OrderStatus.ALL);
      if (!anySelected) {
        return newChips.map((chip) => ({
          ...chip,
          isSelected: chip.status === OrderStatus.ALL,
        }));
      }

      return newChips;
    });
  }, []);

  const handleOrderPress = useCallback(
    (order: Order) => {
      router.push({
        pathname: "../order-detail",
        params: { orderId: order.id },
      });
    },
    [router],
  );

  const renderStatusChips = useCallback(() => {
    return (
      <View style={[styles.chipsContainer, { backgroundColor: BRAND_COLORS.screenBg.fresh, borderBottomColor: BRAND_COLORS.ui.placeholder }]}>
        <FlatList
          horizontal
          data={selectedStatuses}
          keyExtractor={(item) => item.status}
          renderItem={({ item }) => (
            <OrderStatusChip
              label={item.label}
              isSelected={item.isSelected}
              onPress={() => handleChipPress(item.status)}
            />
          )}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.chipsContent}
        />
      </View>
    );
  }, [selectedStatuses, handleChipPress]);

  const renderEmpty = useCallback(() => {
    if (loading) {
      return <SkeletonShimmerList count={4} />;
    }
    return (
      <View style={styles.emptyContainer}>
        <View style={styles.emptyIconContainer}>
          <Ionicons name="receipt-outline" size={120} color={BRAND_COLORS.ui.heading} />
        </View>
        <Text style={[styles.emptyTitle, { color: BRAND_COLORS.ui.heading }]}>{ORDER_HISTORY_STRINGS.EMPTY_TITLE}</Text>
        <Text style={[styles.emptyMessage, { color: BRAND_COLORS.ui.subtitle }]}>{ORDER_HISTORY_STRINGS.EMPTY_MESSAGE}</Text>
      </View>
    );
  }, [loading, BRAND_COLORS]);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color={BRAND_COLORS.bta.primaryBg} />
      </View>
    );
  }, [loadingMore]);



  return (
    <BaseAuthenticatedLayout backgroundColor={BRAND_COLORS.screenBg.fresh} safeAreaEdges={['left', 'right']}>
      {renderStatusChips()}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <OrderHistoryItem order={item} onPress={() => handleOrderPress(item)} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={[BRAND_COLORS.bta.primaryBg]} />}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={renderEmpty}
        ListFooterComponent={renderFooter}
        contentContainerStyle={filteredOrders.length === 0 ? styles.emptyList : undefined}
      />
    </BaseAuthenticatedLayout>
  );
}

const styles = StyleSheet.create({
  chipsContainer: {
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  chipsContent: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    height: Dimensions.get('window').height * 0.7,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    marginBottom: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  emptyList: {
    flexGrow: 1,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: "center",
  },
});
