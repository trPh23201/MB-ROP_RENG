import { useRouter } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { Order } from "../../../domain/entities/Order";
import { useAppSelector } from "../../../utils/hooks";
import { BaseAuthenticatedLayout } from "../../layouts/BaseAuthenticatedLayout";
import { ITEMS_PER_PAGE, ORDER_HISTORY_STRINGS, STATUS_CHIPS } from "./OrderHistoryConstants";
import { OrderStatus } from "./OrderHistoryEnums";
import { StatusChipData } from "./OrderHistoryInterfaces";
import { OrderHistoryService } from "./OrderHistoryService";
import { OrderHistoryItem } from "./components/OrderHistoryItem";
import { OrderStatusChip } from "./components/OrderStatusChip";

export default function OrderHistoryScreen() {
  const router = useRouter();
  const { user } = useAppSelector((state) => state.auth);
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
        console.log("[OrderHistory] No user UUID");
        return;
      }

      try {
        const result = await service.loadOrders(user.uuid, pageNum, ITEMS_PER_PAGE, undefined);

        setAllOrders((prev) => (append ? [...prev, ...result.orders] : result.orders));
        setHasMore(result.hasMore);
        setPage(pageNum);
      } catch (error) {
        console.error("[OrderHistory] Load error:", error);
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
      <View style={styles.chipsContainer}>
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
    if (loading) return null;
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyTitle}>{ORDER_HISTORY_STRINGS.EMPTY_TITLE}</Text>
        <Text style={styles.emptyMessage}>{ORDER_HISTORY_STRINGS.EMPTY_MESSAGE}</Text>
      </View>
    );
  }, [loading]);

  const renderFooter = useCallback(() => {
    if (!loadingMore) return null;
    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="small" color="#606A37" />
      </View>
    );
  }, [loadingMore]);

  if (loading && !refreshing) {
    return (
      <BaseAuthenticatedLayout>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#606A37" />
          <Text style={styles.loadingText}>{ORDER_HISTORY_STRINGS.LOADING}</Text>
        </View>
      </BaseAuthenticatedLayout>
    );
  }

  return (
    <BaseAuthenticatedLayout safeAreaEdges={['left', 'right']}>
      {renderStatusChips()}
      <FlatList
        data={filteredOrders}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        renderItem={({ item }) => <OrderHistoryItem order={item} onPress={() => handleOrderPress(item)} />}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={["#606A37"]} />}
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
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: "#666666",
  },
  chipsContainer: {
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  chipsContent: {
    paddingHorizontal: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
    paddingTop: 80,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 14,
    color: "#666666",
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
