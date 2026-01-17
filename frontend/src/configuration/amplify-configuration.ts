// amplify-configuration.ts
export const amplifyConfiguration = {
    Auth: {
        Cognito: {
            region: process.env.EXPO_PUBLIC_COGNITO_REGION || '',
            userPoolId: process.env.EXPO_PUBLIC_COGNITO_USER_POOL_ID || '',
            userPoolClientId: process.env.EXPO_PUBLIC_COGNITO_CLIENT_ID || '',
            loginWith: {
                email: true,
            },
        },
    },
};
