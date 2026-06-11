class ApiService {
    static BASE_URL =
        "http://localhost:8080";

    static async getPasswords() {
        const token =
            localStorage.getItem(
                "token"
            );

        const response =
            await fetch(
                `${this.BASE_URL}/passwords/${token}`
            );

        return await response.json();
    }

    // add/update/delete Password requests
    static async addPassword(website, username, password, category, notes) {
        const token = localStorage.getItem("token");

        const response =
            await fetch(
                `${this.BASE_URL}/addPassword/${token}/${encodeURIComponent(website)}/${encodeURIComponent(username)}/${encodeURIComponent(password)}/${encodeURIComponent(category)}/${encodeURIComponent(notes)}`
            );

        const data = await response.json();

        return data;
    }

    static async updatePassword(id, website, username, password, category, notes) {
        const token = localStorage.getItem("token");

        const response =
            await fetch(
                `${this.BASE_URL}/updatePassword/${token}/${id}/${encodeURIComponent(website)}/${encodeURIComponent(username)}/${encodeURIComponent(password)}/${encodeURIComponent(category)}/${encodeURIComponent(notes)}`
            );

        return await response.json();
    }

    static async deletePassword(id) {

        const token =
            localStorage.getItem("token");

        const response =
            await fetch(
                `${this.BASE_URL}/deletePassword/${token}/${id}`
            );

        const data = await response.json();

        return data;
    }

    static async getCredential(site) {
        const token =
            localStorage.getItem(
                "token"
            );

        const response =
            await fetch(
                `${this.BASE_URL}/credential/${token}/${encodeURIComponent(site)}`
            );

        return await response.json();
    }

    static async getCategories() {
        const token = localStorage.getItem("token");

        const response = await fetch(`${this.BASE_URL}/categories/${token}`);

        return await response.json();
    }

    static async ping() {
        const response =
            await fetch(
                `${this.BASE_URL}/ping`
            );

        return response.ok;
    }
}