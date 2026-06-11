// =====================================
// HELPERS
// =====================================

function setNativeValue(
    element,
    value
) {
    const prototype =
        Object.getPrototypeOf(
            element
        );

    const valueSetter =
        Object
            .getOwnPropertyDescriptor(
                prototype,
                "value"
            )
            ?.set;

    if (valueSetter) {
        valueSetter.call(
            element,
            value
        );
    }
    else {
        element.value = value;
    }

    element.dispatchEvent(
        new Event(
            "input",
            {
                bubbles: true
            }
        )
    );

    element.dispatchEvent(
        new Event("change",{bubbles: true})
    );

    element.dispatchEvent(
        new Event("blur", { bubbles: true })
    );
}


// =====================================
// VISIBILITY CHECK
// =====================================

function isVisible(element) {
    return (element && element.offsetParent !== null);
}


// =====================================
// FIND USERNAME FIELD
// =====================================

function findUsernameField() {
    const selectors =
        [
            'input[type="email"]',

            'input[name*="email" i]',
            'input[id*="email" i]',

            'input[name*="user" i]',
            'input[id*="user" i]',

            'input[name*="login" i]',
            'input[id*="login" i]',

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
            if (isVisible(field)) {
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
        if (isVisible(field)) {
            return field;
        }
    }

    return null;
}


// =====================================
// AUTOFILL
// =====================================

function autofill(username, password) {

    const usernameField = findUsernameField();
    const passwordField = findPasswordField();

    if (usernameField) {
        usernameField.focus();

        setNativeValue(usernameField, username);
    }

    if (passwordField) {
        passwordField.focus();

        setNativeValue(passwordField, password);
    }

    console.log("HashVault Autofill Complete");
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