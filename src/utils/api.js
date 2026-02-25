const API_URL = process.env.VUE_APP_API_URL || 'http://api.example.com';

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
            return response.json().then(err => Promise.reject(err));
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