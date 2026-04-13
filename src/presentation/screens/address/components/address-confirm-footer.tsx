import React from "react";
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useBrandColors } from "../../../theme/BrandColorContext";

interface AddressConfirmFooterProps {
  addressString: string;
  isLoading: boolean;
  isDisabled: boolean;
  onConfirm: () => void;
}

export const AddressConfirmFooter = React.memo(function AddressConfirmFooter({
  addressString,
  isLoading,
  isDisabled,
  onConfirm,
}: AddressConfirmFooterProps) {
  const BRAND_COLORS = useBrandColors();

  return (
    <View style={[styles.footer, { backgroundColor: BRAND_COLORS.primary.p1 }]}>
      <View style={styles.addressPreview}>
        <Text style={[styles.label, { color: BRAND_COLORS.secondary.s3 }]}>ĐỊA CHỈ GIAO HÀNG</Text>
        <View style={styles.addressRow}>
          <Text style={styles.addressText} numberOfLines={2}>
            {isLoading ? "Đang xác định vị trí..." : addressString || "Di chuyển bản đồ để chọn địa chỉ"}
          </Text>
          {isLoading && (
            <ActivityIndicator size="small" color={BRAND_COLORS.primary.p3} style={styles.addressLoader} />
          )}
        </View>
      </View>

      <TouchableOpacity
        style={[
          styles.btnConfirm,
          { backgroundColor: BRAND_COLORS.primary.p3 },
          isDisabled && styles.btnDisabled,
        ]}
        onPress={onConfirm}
        disabled={isDisabled}
        activeOpacity={0.8}
      >
        <Text style={[styles.btnText, { color: BRAND_COLORS.primary.p1 }]}>Xác nhận địa chỉ này</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 34,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -4 },
  },
  addressPreview: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: "600", letterSpacing: 0.5, marginBottom: 6 },
  addressRow: { flexDirection: "row", alignItems: "center" },
  addressText: { flex: 1, fontSize: 16, fontWeight: "600", color: "#1A1A1A", lineHeight: 22 },
  addressLoader: { marginLeft: 8 },
  btnConfirm: { paddingVertical: 16, borderRadius: 12, alignItems: "center" },
  btnDisabled: { backgroundColor: "#CCCCCC" },
  btnText: { fontWeight: "700", fontSize: 16 },
});
