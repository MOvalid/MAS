import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useTheme } from 'react-native-paper';
import { AppText, AppCard } from '@/components/common';
import { metrics } from '@/theme/metrics';
import { getFAQData } from '@/utils/data-generator';

export type FaqItem = {
    id: string;
    question: string;
    answer: string;
};

const FAQ_DATA = getFAQData();

export const FaqScreen = () => {
    const theme = useTheme();
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const toggleItem = (id: string) => {
        setExpandedId((prev) => (prev === id ? null : id));
    };

    const styles = StyleSheet.create({
        container: {
            flex: 1,
            padding: metrics.spacing.lg,
        },
        title: {
            marginBottom: metrics.spacing.xl,
        },
        card: {
            marginVertical: metrics.spacing.sm,
            backgroundColor: theme.colors.background,
        },
        questionRow: {
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        questionText: {
            flex: 1,
            fontWeight: metrics.fontWeight.semibold,
        },
        answer: {
            marginTop: metrics.spacing.md,
            color: theme.colors.onSurfaceVariant,
        },
        divider: {
            height: 1,
            backgroundColor: theme.colors.outlineVariant,
            marginTop: metrics.spacing.md,
        },
    });

    return (
        <ScrollView style={styles.container}>
            <AppText variant="headlineMedium" style={styles.title}>
                Najczęściej zadawane pytania
            </AppText>

            {FAQ_DATA.map((item) => {
                const expanded = expandedId === item.id;

                return (
                    <AppCard key={item.id} style={styles.card}>
                        <TouchableOpacity onPress={() => toggleItem(item.id)}>
                            <View style={styles.questionRow}>
                                <AppText variant="titleMedium" style={styles.questionText}>
                                    {item.question}
                                </AppText>
                                <AppText>{expanded ? '-' : '+'}</AppText>
                            </View>
                        </TouchableOpacity>

                        {expanded && (
                            <>
                                <View style={styles.divider} />
                                <AppText variant="bodyLarge" style={styles.answer}>
                                    {item.answer}
                                </AppText>
                            </>
                        )}
                    </AppCard>
                );
            })}
        </ScrollView>
    );
};
