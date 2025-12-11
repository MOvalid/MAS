import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { AppTag } from './AppTag';
import { metrics } from '@/theme/metrics';

interface AppTagListProps {
    tags: { label: string; value: string }[];
    selectedValues: string[];
    onRemove: (value: string) => void;
}

export const AppTagList: React.FC<AppTagListProps> = ({ tags, selectedValues, onRemove }) => {
    return (
        <View style={styles.tagsContainer}>
            {selectedValues.map((value) => {
                const tag = tags.find((t) => t.value === value);
                if (!tag) return null;
                return <AppTag key={value} label={tag.label} onRemove={() => onRemove(value)} />;
            })}
        </View>
    );
};

const styles = StyleSheet.create({
    tagsContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: metrics.spacing.xs,
        marginTop: metrics.spacing.sm,
    } as ViewStyle,
});
