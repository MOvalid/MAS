// utils/error-utils.ts

export type ErrorMessage = {
    title: string;
    message: string;
    details?: string;
};

const HTTP_ERROR_MESSAGES: Record<number, Omit<ErrorMessage, 'details'>> = {
    400: { title: 'Błąd żądania', message: 'Wysłano nieprawidłowe dane.' },
    401: { title: 'Brak autoryzacji', message: 'Nie jesteś zalogowany lub sesja wygasła.' },
    403: { title: 'Brak dostępu', message: 'Nie masz uprawnień do wykonania tej akcji.' },
    404: { title: 'Nie znaleziono', message: 'Żądany zasób nie istnieje.' },
    500: { title: 'Błąd serwera', message: 'Coś poszło nie tak po stronie serwera.' },
    503: { title: 'Serwis niedostępny', message: 'Spróbuj ponownie później.' },
};

export const getFriendlyErrorMessage = (error: unknown): ErrorMessage => {
    if (typeof error === 'object' && error !== null) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const err = error as any;

        if (err.response?.status) {
            const status = err.response.status;
            const mapped = HTTP_ERROR_MESSAGES[status];
            return {
                title: mapped?.title ?? 'Błąd',
                message: mapped?.message ?? 'Wystąpił nieznany błąd.',
                details: err.response.data?.message ?? JSON.stringify(err.response.data),
            };
        }

        if (err.code) {
            switch (err.code) {
                case 'NETWORK_ERROR':
                    return {
                        title: 'Brak połączenia',
                        message: 'Sprawdź połączenie internetowe i spróbuj ponownie.',
                    };
                case 'TIMEOUT':
                    return {
                        title: 'Przekroczono czas oczekiwania',
                        message: 'Serwer nie odpowiedział na czas. Spróbuj ponownie.',
                    };
                default:
                    return {
                        title: 'Błąd',
                        message: err.message ?? 'Wystąpił nieznany błąd.',
                        details: JSON.stringify(err),
                    };
            }
        }

        return {
            title: 'Błąd',
            message: err.message ?? 'Wystąpił nieznany błąd.',
            details: JSON.stringify(err),
        };
    }

    if (typeof error === 'string') {
        return { title: 'Błąd', message: error };
    }

    // fallback
    return { title: 'Błąd', message: 'Wystąpił nieznany błąd.' };
};
