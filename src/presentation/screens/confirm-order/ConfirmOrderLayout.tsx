import React, { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BRAND_COLORS } from '../../theme/colors';

interface ConfirmOrderLayoutProps {
    children: ReactNode;
}

export function ConfirmOrderLayout({ children }: ConfirmOrderLayoutProps) {
    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <View style={styles.content}>{children}</View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: BRAND_COLORS.screenBg.warm,
    },
    content: {
        flex: 1,
    },
});
