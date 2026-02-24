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