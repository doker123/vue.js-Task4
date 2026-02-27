const API_URL = process.env.VUE_APP_API_URL || 'http://lifestealer86.ru/api-shop';


const getAuthHeaders = () => {
    const token = localStorage.getItem('user_token');
    return {
        'Content-Type': 'application/json;charset=UTF-8', ...(token ? {'Authorization': `Bearer ${token}`} : {})
    };
};

export const login = (email, password) => {
    return fetch(`${API_URL}/login`, {
        method: 'POST', headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }, body: JSON.stringify({
            email: email, password: password,
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
        method: 'POST', headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }, body: JSON.stringify({
            fio: fio, email: email, password: password,
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
        method: 'GET', headers: {
            'Content-Type': 'application/json;charset=UTF-8',
        }
    }).then(response => {
        if (!response.ok) {
            return response.json().then(err => Promise.reject(err));
        }
        return response.json();
    });
};

export const getCart = () => {
    return fetch(`${API_URL}/cart`, {
        method: 'GET', headers: {
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
    }).then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                try {
                    const err = JSON.parse(text);
                    return Promise.reject(err);
                } catch (e) {
                    return Promise.reject({error: {message: text || 'Server error'}});
                }
            });
        }
        return response.json();
    });
};

export const removeFromCart = (cartItemId) => {
    return fetch(`${API_URL}/cart/${cartItemId}`, {
        method: 'DELETE', headers: {
            'Authorization': `Bearer ${localStorage.getItem('user_token')}`
        }
    }).then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                try {
                    const err = JSON.parse(text);
                    return Promise.reject(err);
                } catch (e) {
                    return Promise.reject({error: {message: text || 'Server error'}});
                }
            });
        }
        return response.json();
    });
};

export const addToCart = (productId) => {
    const token = localStorage.getItem('user_token');
    if (!token) {
        return Promise.reject(new Error('Пользователь не авторизован'));
    }

    const url = `${API_URL}/cart/${productId}`;

    return fetch(url, {
        method: 'POST', headers: {
            'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`
        }
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

export const createOrder = () => {

    const token = localStorage.getItem('user_token');
    if (!token) {
        return Promise.reject(new Error('Пользователь не авторизован.'));
    }

    const url = `${API_URL}/order`;

    return fetch(url, {
        method: 'POST', headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`

        }
    }).then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                let parsedError;
                try {
                    parsedError = JSON.parse(text);
                } catch (e) {
                    parsedError = {error: {message: text || 'Неизвестная ошибка сервера'}};
                }
                return Promise.reject(parsedError);
            });
        }
        return response.json();
    });
};
export const getOrders = () => {

    const token = localStorage.getItem('user_token');
    if (!token) {
        return Promise.reject(new Error('Пользователь не авторизован.'));
    }


    const url = `${API_URL}/order`;

    return fetch(url, {
        method: 'GET',
        headers: getAuthHeaders(),
    }).then(response => {
        if (!response.ok) {
            return response.text().then(text => {
                let parsedError;
                try {
                    parsedError = JSON.parse(text);
                } catch (e) {

                    parsedError = { error: { message: text || 'Неизвестная ошибка сервера' } };
                }
                return Promise.reject(parsedError);
            });
        }
        return response.json();
    });
};
