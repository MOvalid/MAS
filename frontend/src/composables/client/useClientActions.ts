import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

export const useClientActions = (onDeleteCallback?: (id: string, isCompany: boolean) => void) => {
    const navigation = useNavigation();

    const handleEdit = useCallback(
        (id: string, isCompany: boolean) => {
            if (isCompany) {
                navigation.navigate('CompanyAddEditScreen', { id });
            } else {
                navigation.navigate('CustomerAddEditScreen', { id });
            }
        },
        [navigation]
    );

    const handleDelete = useCallback(
        (id: string, isCompany: boolean, name: string) => {
            Alert.alert('Potwierdzenie', `Czy na pewno chcesz usunąć "${name}"?`, [
                { text: 'Anuluj', style: 'cancel' },
                {
                    text: 'Usuń',
                    style: 'destructive',
                    onPress: () => onDeleteCallback?.(id, isCompany),
                },
            ]);
        },
        [onDeleteCallback]
    );

    return { handleEdit, handleDelete };
};
