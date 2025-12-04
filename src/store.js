/**
 * Simple State Management
 */
export const store = {
    state: {
        user: JSON.parse(localStorage.getItem('user')) || null,
        token: localStorage.getItem('token') || null,
    },

    isAuthenticated() {
        return !!this.state.token;
    },

    setUser(user) {
        this.state.user = user;
        localStorage.setItem('user', JSON.stringify(user));
    },

    setToken(token) {
        this.state.token = token;
        localStorage.setItem('token', token);
    },

    logout() {
        this.state.user = null;
        this.state.token = null;
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/';
    }
};
