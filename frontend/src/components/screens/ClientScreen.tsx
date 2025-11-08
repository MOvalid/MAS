import React from 'react';
import { View, StyleSheet } from 'react-native';
import { AppText } from '../common/AppText';
import { Dimensions } from 'react-native';

const screenHeight = Dimensions.get('window').height;

export default function ClientScreen() {
    return (
        <View style={styles.container}>
            <AppText>ClientScreen</AppText>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        transform: [{ translateY: -screenHeight * 0.1 }],
    },
    signupText: {
        marginTop: 16,
    },
});
