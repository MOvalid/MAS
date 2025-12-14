import { useAppTheme } from '@/theme/AppThemeContext';
import { metrics } from '@/theme/metrics';
import React, { ReactNode, useRef, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, Dimensions, ViewStyle } from 'react-native';
import { MD3Colors } from 'react-native-paper/lib/typescript/types';

interface AppTooltipProps {
    content: string;
    children: ReactNode;
    position?: 'top' | 'bottom';
}

interface TooltipPosition {
    top?: number;
    bottom?: number;
    left: number;
}

const TOOLTIP_OFFSET = metrics.spacing.sm;
const SCREEN_WIDTH = Dimensions.get('window').width;
const MAX_TOOLTIP_WIDTH = 200;

export const AppTooltip: React.FC<AppTooltipProps> = ({ content, children, position = 'top' }) => {
    const [visible, setVisible] = useState(false);
    const [tooltipPosition, setTooltipPosition] = useState<TooltipPosition | null>(null);
    const triggerRef = useRef<View | null>(null);
    const hideTimeout = useRef<NodeJS.Timeout | null>(null);
    const { colors } = useAppTheme();

    const show = () => {
        if (hideTimeout.current) {
            clearTimeout(hideTimeout.current);
            hideTimeout.current = null;
        }

        triggerRef.current?.measureInWindow((x, y, width, height) => {
            const maxLeft = SCREEN_WIDTH - MAX_TOOLTIP_WIDTH - metrics.spacing.sm;
            const defaultLeft = x + width / 2 - MAX_TOOLTIP_WIDTH / 2;

            const calculatedPosition: TooltipPosition = {
                left: Math.max(metrics.spacing.sm, Math.min(defaultLeft, maxLeft)),
            };

            if (position === 'top') {
                calculatedPosition.top = y - TOOLTIP_OFFSET;
                calculatedPosition.bottom = undefined;
            } else {
                calculatedPosition.top = y + height + TOOLTIP_OFFSET;
                calculatedPosition.bottom = undefined;
            }

            setTooltipPosition(calculatedPosition);
            setVisible(true);
        });
    };

    const hide = () => {
        hideTimeout.current = setTimeout(() => {
            setVisible(false);
        }, 200);
    };

    const styles = getStyles(colors);

    return (
        <View>
            <Pressable ref={triggerRef} onPress={show} onHoverIn={show} onHoverOut={hide}>
                {children}
            </Pressable>

            <Modal visible={visible} transparent animationType="fade" onRequestClose={hide}>
                <Pressable style={styles.overlay} onPress={hide}>
                    <View onMouseEnter={show} onMouseLeave={hide}>
                        {tooltipPosition && (
                            <View
                                style={[
                                    styles.tooltip,
                                    { backgroundColor: colors.surface },
                                    {
                                        position: 'absolute',
                                        top: tooltipPosition.top,
                                        left: tooltipPosition.left,
                                    } as ViewStyle,
                                ]}
                            >
                                <Text style={styles.tooltipText}>{content}</Text>
                            </View>
                        )}
                    </View>
                </Pressable>
            </Modal>
        </View>
    );
};

const getStyles = (colors: MD3Colors) =>
    StyleSheet.create({
        overlay: {
            flex: 1,
            backgroundColor: 'transparent',
        },
        tooltip: {
            padding: metrics.spacing.sm,
            borderRadius: metrics.radius.sm,
            maxWidth: MAX_TOOLTIP_WIDTH,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: metrics.radius.sm,
            elevation: 5,
        },
        tooltipText: {
            color: colors.onSurface,
        },
    });
