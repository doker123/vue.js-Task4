const API_URL = process.env.VUE_APP_API_URL || 'http://lifestealer86.ru/api-shop';

const getAuthHeaders = () => {
    const token = localStorage.getItem('user_token');
    return {
        'Content-Type': 'application/json;charset=UTF-8',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    };
};

export const login = (email, password) => {
    return fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
            email: email,
            password: password,
        })
    }).then(response => {
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
        }
        return response.json();
    });
};

export const register = (fio, email, password) => {
    return fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        },
        body: JSON.stringify({
            fio: fio,
            email: email,
            password: password,
        })
    }).then(response => {
        if (!response.ok) {

            return response.text().then(text => {
                try {
                    const err = JSON.parse(text);
                    return Promise.reject(err);
                } catch (e) {
                    return Promise.reject({
                        error: {
                            message: text || 'Ошибка сервера'
                        }
                    });
                }
            });
        }
        return response.json();
    });
};
export const getProducts = () => {
    return fetch(`${API_URL}/products`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    }).then(response => {
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
        }
        return response.json();
    });
};

export const createOrder = () => {
    const token = localStorage.getItem('user_token');
    return fetch(`${API_URL}/order`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        }
    }).then(async response => {
        const responseText = await response.text();
        if (!response.ok) {
            try {
                const err = JSON.parse(responseText);
                return Promise.reject(err);
            } catch (e) {
                return Promise.reject({
                    error: {
                        message: responseText || 'Ошибка сервера'
                    }
                });
            }
        }
        
        try {
            return JSON.parse(responseText);
        } catch (e) {
            return { data: responseText };
        }
    });
};

export const getOrders = () => {
    return fetch(`${API_URL}/order`, {
        method: 'GET',
        headers: getAuthHeaders()
    }).then(response => {
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
        }
        return response.json();
    });
};
