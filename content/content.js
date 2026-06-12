// =====================================
// HELPERS
// =====================================

function setNativeValue(element, value)
{
    const nativeInputValueSetter =
        Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            "value"
        ).set;

    nativeInputValueSetter.call(
        element,
        value
    );

    element.dispatchEvent(
        new InputEvent(
            "input",
            {
                bubbles: true,
                composed: true
            }
        )
    );

    element.dispatchEvent(
        new Event(
            "change",
            {
                bubbles: true
            }
        )
    );
}


// =====================================
// VISIBILITY CHECK
// =====================================

function isVisible(element)
{
    if (!element)
        return false;

    const style =
        getComputedStyle(
            element
        );

    return (
        style.display !== "none" &&
        style.visibility !== "hidden"
    );
}


// =====================================
// FIND USERNAME FIELD
// =====================================

function findUsernameField() {

    const selectors = [
        
        'input[autocomplete="username"]',
        'input[autocomplete="email"]',

        'input[type="email"]',

        'input[name="email"]',
        'input[id="email"]',

        'input[name*="email" i]',
        'input[id*="email" i]',

        'input[name="username"]',
        'input[id="username"]',

        'input[name*="user" i]',
        'input[id*="user" i]',

        'input[name*="login" i]',
        'input[id*="login" i]',

        'input[name*="identifier" i]',
        'input[id*="identifier" i]',

        'input[name*="account" i]',
        'input[id*="account" i]',

        'input[type="text"]'
    ];

    for (const selector of selectors) {
        const fields =
            document.querySelectorAll(
                selector
            );

        for (const field of fields) {
            if (
                isVisible(field) &&
                !field.disabled &&
                !field.readOnly
            ) {
                return field;
            }
        }
    }

    return null;
}


// =====================================
// FIND PASSWORD FIELD
// =====================================

function findPasswordField() {
    const fields =
        document.querySelectorAll(
            'input[type="password"]'
        );

    for (const field of fields) {
        if (
            isVisible(field) &&
            !field.disabled &&
            !field.readOnly
        ) {
            return field;
        }
    }

    return null;
}


// =====================================
// AUTOFILL
// =====================================

async function autofill(username, password) {
    let attempts = 0;

    const interval =
        setInterval(() => {

            const usernameField =
                findUsernameField();

            const passwordField =
                findPasswordField();

            console.log("username:", username);
            console.log("password:", password);
            console.log("usernameField:", usernameField);
            console.log("passwordField:", passwordField);

            if (usernameField) {
                usernameField.focus();

                setNativeValue(
                    usernameField,
                    username
                );
            }

            if (passwordField) {
                passwordField.focus();

                setNativeValue(
                    passwordField,
                    password
                );
            }

            if (usernameField) {
                clearInterval(interval);

                console.log(
                    "HashVault Autofill Complete"
                );
            }

            attempts++;

            if (attempts > 10) {
                clearInterval(interval);
            }

        }, 300);
}


// =====================================
// MESSAGE LISTENER
// =====================================

chrome.runtime.onMessage.addListener(
    (
        request,
        sender,
        sendResponse
    ) => {
        if (
            request.action === "fill"
        ) {
            autofill(
                request.username,
                request.password
            );

            sendResponse({
                success: true
            });
        }

        return true;
    }
);