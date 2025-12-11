import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from 'react-native-paper';
import { AppText } from './AppText';
import { metrics } from '@/theme/metrics';
import AppIconButton from './AppIconButton';
import { IconName } from './icons';

interface AppImageUploadProps {
    imageUrl: string | null;
    onImageSelected: (uri: string) => void;
    onImageRemoved?: () => void;
}

export const AppImageUpload: React.FC<AppImageUploadProps> = ({
    imageUrl,
    onImageSelected,
    onImageRemoved,
}) => {
    const theme = useTheme();
    const [localImageUri, setLocalImageUri] = useState<string | null>(imageUrl);

    const requestPermissions = async () => {
        if (Platform.OS !== 'web') {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                alert('Przepraszamy, potrzebujemy uprawnień do biblioteki zdjęć!');
                return false;
            }
        }
        return true;
    };

    const pickImage = async () => {
        const hasPermission = await requestPermissions();
        if (!hasPermission) return;

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.8,
        });

        if (!result.canceled && result.assets[0]) {
            const uri = result.assets[0].uri;
            setLocalImageUri(uri);
            onImageSelected(uri);
        }
    };

    const removeImage = () => {
        setLocalImageUri(null);
        onImageRemoved?.();
    };

    const styles = StyleSheet.create({
        container: {
            width: '100%',
            aspectRatio: 1,
            borderRadius: metrics.radius.lg,
            borderWidth: 2,
            borderStyle: 'dashed',
            borderColor: theme.colors.outline,
            backgroundColor: theme.colors.background,
            justifyContent: 'center',
            alignItems: 'center',
            overflow: 'hidden',
            position: 'relative',
        },
        imageContainer: {
            width: '100%',
            height: '100%',
        },
        image: {
            width: '100%',
            height: '100%',
        },
        placeholder: {
            alignItems: 'center',
            gap: metrics.spacing.md,
            backgroundColor: theme.colors.background,
        },
        placeholderText: {
            color: theme.colors.onSurfaceVariant,
            textAlign: 'center',
        },
        removeButtonWrapper: {
            position: 'absolute',
            top: metrics.spacing.sm,
            right: metrics.spacing.sm,
            borderRadius: metrics.radius.lg,
            overflow: 'hidden',
        },
    });

    return (
        <TouchableOpacity onPress={pickImage} activeOpacity={0.7}>
            <View style={styles.container}>
                {localImageUri ? (
                    <>
                        <View style={styles.imageContainer}>
                            <Image
                                source={{ uri: localImageUri }}
                                style={styles.image}
                                resizeMode="cover"
                            />
                        </View>

                        <TouchableOpacity
                            onPress={removeImage}
                            style={styles.removeButtonWrapper}
                            activeOpacity={0.7}
                        >
                            <AppIconButton
                                icon={IconName.close}
                                iconColor={theme.colors.backdrop}
                                size={32}
                                onPress={() => console.log()}
                            />
                        </TouchableOpacity>
                    </>
                ) : (
                    <View style={styles.placeholder}>
                        <AppIconButton
                            icon={IconName.camera}
                            iconColor={theme.colors.primary}
                            size={48}
                            onPress={() => console.log()}
                        />
                        <AppText variant="bodyLarge" style={styles.placeholderText}>
                            Kliknij aby dodać zdjęcie
                        </AppText>
                        <AppText variant="bodySmall" style={styles.placeholderText}>
                            Zalecany format: kwadrat (1:1)
                        </AppText>
                    </View>
                )}
            </View>
        </TouchableOpacity>
    );
};
