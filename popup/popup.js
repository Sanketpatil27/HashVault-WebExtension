// =====================================
// SCREENS
// =====================================

const loginScreen =
    document.getElementById("loginScreen");

const autofillScreen =
    document.getElementById("autofillScreen");

const vaultScreen =
    document.getElementById("vaultScreen");

const detailsScreen =
    document.getElementById("detailsScreen");

const settingsScreen =
    document.getElementById("settingsScreen");

const passwordFormScreen =
    document.getElementById("passwordFormScreen");


// =====================================
// GLOBALS
// =====================================

let selectedPassword = null;
let editingPasswordId = null;
let passwordVisible = false;
let currentPasswords = [];

// =====================================
// SCREEN HELPERS
// =====================================

function hideAllScreens() {
    loginScreen.classList.add("hidden");
    autofillScreen.classList.add("hidden");
    vaultScreen.classList.add("hidden");
    detailsScreen.classList.add("hidden");
    settingsScreen.classList.add("hidden");
    passwordFormScreen.classList.add("hidden");
}

function showScreen(screen) {
    hideAllScreens();

    screen.classList.remove("hidden");
}


// =====================================
// LOGIN
// =====================================

async function handleLogin() {
    const username =
        document.getElementById(
            "usernameInput"
        ).value;

    const password =
        document.getElementById(
            "passwordInput"
        ).value;

    const success = await AuthService.login(
        username,
        password
    );

    if (success) {
        initializeAutofill();

        showScreen(
            autofillScreen
        );
    }
    else {
        alert(
            "Invalid Credentials"
        );
    }
}


// =====================================
// WEBSITE DETECTION
// =====================================

async function getCurrentWebsite() {
    const [tab] =
        await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

    if (!tab || !tab.url)
        return "";

    try {
        const url =
            new URL(tab.url);

        return url.hostname
            .replace("www.", "");
    }
    catch {
        return "";
    }
}


// =====================================
// AUTOFILL PAGE
// =====================================

async function initializeAutofill() {
    const hostname =
        await getCurrentWebsite();

    document
        .getElementById(
            "currentSite"
        )
        .innerText =
        hostname || "Unknown";

    const credential =
        await ApiService
            .getCredential(
                hostname
            );

    if (credential) {
        document.getElementById("currentAccount")
            .innerText = credential.username;

        selectedPassword =
            credential;
    }
    else {
        document
            .getElementById(
                "currentAccount"
            )
            .innerText =
            "No Credentials Found";
    }

    updateConnectionStatus();
}


// =====================================
// CONNECTION STATUS
// =====================================

async function updateConnectionStatus() {
    const connected =
        await ConnectionService
            .isConnected();

    document
        .getElementById(
            "connectionStatus"
        )
        .innerText =
        connected
            ? "Connected"
            : "Offline";
}


// =====================================
// VAULT
// =====================================

async function loadPasswords(
    searchTerm = ""
) {
    const passwordList =
        document.getElementById(
            "passwordList"
        );

    passwordList.innerHTML = "";

    currentPasswords = await ApiService.getPasswords();
    let passwords = currentPasswords;

    if (searchTerm) {
        passwords =
            passwords.filter(password =>
                password.website
                    .toLowerCase()
                    .includes(
                        searchTerm
                            .toLowerCase()
                    )
            );
    }

    passwords.forEach(password => {
        const card =
            document.createElement(
                "div"
            );

        card.className =
            "passwordItem";

        card.innerHTML =
            `
            <h4>
                ${password.website}
            </h4>

            <p>
                ${password.username}
            </p>

            <button
                class="viewBtn"
                data-id="${password.id}">
                View
            </button>
        `;

        passwordList.appendChild(
            card
        );
    });

    bindViewButtons();
}


// =====================================
// DETAILS
// =====================================

function bindViewButtons() {
    document
        .querySelectorAll(
            ".viewBtn"
        )
        .forEach(button => {
            button.addEventListener(
                "click",
                () => {
                    const id =
                        Number(
                            button.dataset.id
                        );

                    openPasswordDetails(
                        id
                    );
                });
        });
}

function openPasswordDetails(id) {
    selectedPassword =
        currentPasswords.find(
            password =>
                Number(password.id) === Number(id)
        );

    passwordVisible = false;

    document
        .getElementById(
            "detailWebsite"
        )
        .innerText =
        selectedPassword.website;

    document
        .getElementById(
            "detailUsername"
        )
        .innerText =
        selectedPassword.username;

    document
        .getElementById(
            "detailNotes"
        )
        .innerText =
        selectedPassword.notes;

    document
        .getElementById(
            "detailPassword"
        )
        .innerText =
        "********";

    showScreen(
        detailsScreen
    );
}


// =====================================
// ADD PASSWORD
// =====================================

function openAddPasswordForm() {
    editingPasswordId = null;

    document
        .getElementById(
            "formTitle"
        )
        .innerText =
        "Add Password";

    document
        .getElementById(
            "websiteInput"
        )
        .value = "";

    document
        .getElementById(
            "vaultUsernameInput"
        )
        .value = "";

    document
        .getElementById(
            "vaultPasswordInput"
        )
        .value = "";

    document
        .getElementById(
            "notesInput"
        )
        .value = "";

    showScreen(
        passwordFormScreen
    );
}


// =====================================
// EDIT PASSWORD
// =====================================

function openEditPasswordForm() {
    editingPasswordId =
        selectedPassword.id;

    document
        .getElementById(
            "formTitle"
        )
        .innerText =
        "Edit Password";

    document
        .getElementById(
            "websiteInput"
        )
        .value =
        selectedPassword.website;

    document
        .getElementById(
            "vaultUsernameInput"
        )
        .value =
        selectedPassword.username;

    document
        .getElementById(
            "vaultPasswordInput"
        )
        .value =
        selectedPassword.password;

    document
        .getElementById(
            "notesInput"
        )
        .value =
        selectedPassword.notes;

    showScreen(
        passwordFormScreen
    );
}


// =====================================
// SAVE PASSWORD
// =====================================

async function savePassword() {
    const website =
        document.getElementById(
            "websiteInput"
        ).value;

    const username =
        document.getElementById(
            "vaultUsernameInput"
        ).value;

    const password =
        document.getElementById(
            "vaultPasswordInput"
        ).value;

    const notes =
        document.getElementById(
            "notesInput"
        ).value;

    if (!website || !username || !password) {
        alert("Fill all fields");

        return;
    }

    if (editingPasswordId) {
        await ApiService.updatePassword(editingPasswordId, website, username, password, notes);
    }
    else {
        await ApiService.addPassword(website, username, password, notes);
    }

    await loadPasswords();

    showScreen(
        vaultScreen
    );
}


// =====================================
// DELETE PASSWORD
// =====================================

async function deletePassword() {
    if (!selectedPassword)
        return;

    const confirmed =
        confirm(
            "Delete Password?"
        );

    if (!confirmed)
        return;

    await ApiService.deletePassword(selectedPassword.id);

    await loadPasswords();
    await initializeAutofill();

    showScreen(vaultScreen);
}


// =====================================
// PASSWORD VISIBILITY
// =====================================

function togglePassword() {
    if (!selectedPassword)
        return;

    passwordVisible =
        !passwordVisible;

    document
        .getElementById(
            "detailPassword"
        )
        .innerText =
        passwordVisible
            ? selectedPassword.password
            : "********";
}


// =====================================
// COPY PASSWORD
// =====================================

async function copyPassword() {
    if (!selectedPassword)
        return;

    await navigator.clipboard
        .writeText(
            selectedPassword.password
        );

    alert("Password Copied");
}


// =====================================
// AUTOFILL
// =====================================

async function autofill() {
    if (!selectedPassword)
        return;

    const [tab] =
        await chrome.tabs.query({
            active: true,
            currentWindow: true
        });

    chrome.tabs.sendMessage(
        tab.id,
        {
            action: "fill",

            username:
                selectedPassword.username,

            password:
                selectedPassword.password
        }
    );
}


// =====================================
// SETTINGS
// =====================================

function lockVault() {
    AuthService.logout();

    showScreen(
        loginScreen
    );
}


// =====================================
// Adding events
// =====================================

function generatePassword() {
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZ" +
        "abcdefghijklmnopqrstuvwxyz" +
        "0123456789" +
        "!@#$%^&*";

    let password = "";

    for (let i = 0; i < 16; i++) {
        password +=
            chars[
            Math.floor(
                Math.random() *
                chars.length
            )
            ];
    }

    document
        .getElementById(
            "vaultPasswordInput"
        )
        .value = password;
}


document.addEventListener(
    "DOMContentLoaded",
    async () => {
        if (
            AuthService.isLoggedIn()
        ) {
            await initializeAutofill();

            showScreen(
                autofillScreen
            );
        }
        else {
            showScreen(
                loginScreen
            );
        }

        document
            .getElementById(
                "loginBtn"
            )
            .addEventListener(
                "click",
                handleLogin
            );

        document
            .getElementById(
                "openVaultBtn"
            )
            .addEventListener(
                "click",
                async () => {
                    await loadPasswords();

                    showScreen(
                        vaultScreen
                    );
                });

        document
            .getElementById(
                "settingsBtn"
            )
            .addEventListener(
                "click",
                () => {
                    showScreen(
                        settingsScreen
                    );
                });

        document
            .getElementById(
                "addPasswordBtn"
            )
            .addEventListener(
                "click",
                openAddPasswordForm
            );

        document
            .getElementById(
                "savePasswordBtn"
            )
            .addEventListener(
                "click",
                savePassword
            );

        document
            .getElementById(
                "editPasswordBtn"
            )
            .addEventListener(
                "click",
                openEditPasswordForm
            );

        document
            .getElementById(
                "deletePasswordBtn"
            )
            .addEventListener(
                "click",
                deletePassword
            );

        document
            .getElementById(
                "togglePasswordBtn"
            )
            .addEventListener(
                "click",
                togglePassword
            );

        document
            .getElementById(
                "copyPasswordBtn"
            )
            .addEventListener(
                "click",
                copyPassword
            );

        document
            .getElementById(
                "autofillBtn"
            )
            .addEventListener(
                "click",
                autofill
            );

        document
            .getElementById(
                "detailAutofillBtn"
            )
            .addEventListener(
                "click",
                autofill
            );

        document
            .getElementById(
                "lockVaultBtn"
            )
            .addEventListener(
                "click",
                lockVault
            );

        document
            .getElementById(
                "searchInput"
            )
            .addEventListener(
                "input",
                async (event) => {
                    await loadPasswords(
                        event.target.value
                    );
                });

        document
            .getElementById(
                "backToAutofillBtn"
            )
            .addEventListener(
                "click",
                async () => {
                    await initializeAutofill();

                    showScreen(autofillScreen)
                }
            );

        document
            .getElementById(
                "backToVaultBtn"
            )
            .addEventListener(
                "click",
                () =>
                    showScreen(
                        vaultScreen
                    )
            );

        document
            .getElementById(
                "backFromFormBtn"
            )
            .addEventListener(
                "click",
                () =>
                    showScreen(
                        vaultScreen
                    )
            );

        document
            .getElementById(
                "backFromSettingsBtn"
            )
            .addEventListener(
                "click",
                () =>
                    showScreen(
                        autofillScreen
                    )
            );

        document
            .getElementById(
                "generatePasswordBtn"
            )
            .addEventListener(
                "click",
                generatePassword
            );
    });