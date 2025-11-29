import { AppText } from '@/components/common';
import { View, StyleSheet } from 'react-native';
import { Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

export const ProductListScreen = () => {
    return (
        <View style={styles.container}>
            <AppText>ProductListScreen</AppText>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        transform: [{ translateY: -screenHeight * 0.1 }], // np. 10% wysokości ekranu w górę
    },
    signupText: {
        marginTop: 16,
    },
});
