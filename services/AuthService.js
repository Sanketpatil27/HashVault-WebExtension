class AuthService {
    static async login(
        username,
        password
    ) {
        const response =
            await fetch(
                `http://localhost:8080/login/${encodeURIComponent(username)}/${encodeURIComponent(password)}`
            );

        const data =
            await response.json();

        if (data.success) {
            localStorage.setItem(
                "token",
                data.token
            );

            localStorage.setItem(
                "loggedIn",
                "true"
            );

            return true;
        }

        return false;
    }

    static logout() {
        localStorage.removeItem(
            "token"
        );

        localStorage.removeItem(
            "loggedIn"
        );
    }

    static isLoggedIn() {
        return !!localStorage.getItem(
            "token"
        );
    }
}