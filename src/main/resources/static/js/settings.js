let rootStyles = $(":root")[0].style;
let styles = JSON.parse(localStorage.getItem("styles"));
let colorVars = {
    'background-color-side-menu': '#ede6b9',
    'background-color-chat': '#ede6b9',
    'text-color-main': '#000000',
    'text-color-chat': '#ffffff',
    'background-color-mine-message': '#b9925e',
    'background-color-yours-message': '#829079',
    'scroll-color': '#b9925e',
    'background-color-side-menu-logo': '#b18013',
    'text-color-menu-toggle': '#ede6b9',
    'text-color-menu-toggle-hover': '#eee793',
    'text-color-link': '#000000',
    'text-color-link-hover': '#b9925e',
    'link-color-before': '#b9925e',
    'background-color-button': '#b9925e',
    'text-color-button': '#ffffff',
    'border-color-button': '#b9925e',
    'border-color-button-hover': '#ffffff',
    'background-color-checkbox-mark': '#ffffff',
    'background-color-checkbox-mark-checked': '#6af321',
    'background-color-textarea': '#efac53',
    'text-color-textarea': '#ffffff',
    'background-color-header': '#efac53',
    'text-color-chat-name-header': '#ffffff',
    'background-color-login-span-or': '#efac53',
    'text-color-login-span-or': '#ffffff',
    'text-color-error-message': '#ff0000',
    'border-color-input-error': '#ff0000',
    'background-color-input-error': '#ffa1a1',
    'background-color-form-body': '#efac53',
    'text-block-color-send-button': '#efac53',
    'send-button-color': '#b18013',
};

$(() => {
    if (styles == null || styles === "null") {
        createClearStyles();
    } else {
        Object.keys(styles).forEach(colorVar => rootStyles.setProperty("--" + colorVar, styles[colorVar]));
    }
    
    let menu = $("#origin-menu");
    let contactMenuToggle = $(".contacts-menu-toggle");
    let settingsMenuToggle = $(".settings-menu-toggle");
    let settingsMenuProfile = $("#settings-menu-profile");
    let settingsMenuDisplayToggle = $(".settings-menu-display-toggle");
    let settingsMenu = $("#settings-menu");
    let settingsMenuDisplay = $("#settings-menu-display");
    let contactMenu = $("#contact-menu");

    menuToggle(menu, contactMenu, contactMenuToggle);
    menuToggle(menu, settingsMenu, settingsMenuToggle);
    menuToggle(settingsMenu, settingsMenuDisplay, settingsMenuDisplayToggle);

    let modalId = "profile-settings";
    let profileSettings = $("<div></div>");
    getUserAvatarBlock(profileSettings).addClass("profile-settings-img");
    let profileSettingsUsername = $("<input type='text' class='form-control mb-2'placeholder='Username' value='" + username + "' />");
    let profileSettingsEmail = $("<input type='email' class='form-control mb-2'placeholder='Email' value='" + email + "' />");
    let profileSettingsPassword = $("<input type='password' class='form-control mb-2' placeholder='Password' />");
    let profileSettingsPasswordRepeat = $("<input type='password' class='form-control d-none mb-2' placeholder='Repeat Password' />");
    let profileSettingsSubmitButton = $("<button type='button' class='btn btn-custom btn-block btn-outline-light'>Submit</button>");
    settingsMenuProfile.attr("data-toggle", "modal");
    settingsMenuProfile.attr("data-target", "#modal-" + modalId);
    profileSettingsPassword.keyup(() => {
        if (profileSettingsPassword.val() === "") {
            profileSettingsPasswordRepeat.addClass("d-none");
            $("#passwordRepeatError").addClass("d-none");
        } else {
            profileSettingsPasswordRepeat.removeClass("d-none");
            $("#passwordRepeatError").removeClass("d-none");
        }
    });
    profileSettingsSubmitButton.click(() => {
        let data = "?id=" + userId + "&";
        let username = profileSettingsUsername.val();
        let email = profileSettingsEmail.val();
        let password = profileSettingsPassword.val();
        let passwordRepeat = profileSettingsPasswordRepeat.val();

        if (username !== "") data += "username=" + username + "&";
        if (email !== "") data += "email=" + email + "&";
        if (password !== "") data += "password=" + password + "&";
        if (passwordRepeat !== "") data += "passwordRepeat=" + passwordRepeat + "&";

        $.ajax({
            type: 'PUT',
            beforeSend: (xhr) => xhr.setRequestHeader(header, token),
            url: getHostname() + "user/" + userId + data,
            async: false,
            cache: false,
            success: (errors) => {
                ['usernameError', 'emailError', 'passwordError', 'passwordRepeatError'].forEach((e) => {
                    $("#" + e).text("");
                });
                console.log(errors);
                for (let error of Object.keys(errors)) {
                    $("#" + error).text(errors[error]);
                }
                if (Object.keys(errors).length === 0) {
                    refreshPage();
                }
            }
        })
    });

    profileSettings.append(profileSettingsUsername);
    profileSettings.append(getErrorP("username"));
    profileSettings.append(profileSettingsEmail);
    profileSettings.append(getErrorP("email"));
    profileSettings.append(profileSettingsPassword);
    profileSettings.append(getErrorP("password"));
    profileSettings.append(profileSettingsPasswordRepeat);
    profileSettings.append(getErrorP("passwordRepeat"));
    profileSettings.append(profileSettingsSubmitButton);

    $("body").append(buildModal(modalId, "Profile Settings", profileSettings));

    let clearButton = $("<button class='btn btn-block btn-custom btn-outline-danger mb-1vh'>Reset to default</button>")
    clearButton.click(() => {
        createClearStyles();
        Object.keys(colorVars).forEach(colorVar => {
            let color = colorVars[colorVar];
            rootStyles.setProperty("--" + colorVar, color);
            $("#" + colorVar).val(color);
        });
    });
    settingsMenuDisplay.append(clearButton);

    Object.keys(colorVars).forEach(colorVar => settingsMenuDisplay.append($(getDisplayColorInput(colorVar, colorVars[colorVar]))));
});

function getDisplayColorInput(colorVar = "", color = "") {
    if (styles[colorVar] != null) {
        color = styles[colorVar];
    }
    let displayColorName = colorVar.replaceAll("-", " ");
    displayColorName = displayColorName.charAt(0).toUpperCase() + displayColorName.slice(1);
    let displayColorBlock = $("<div class='w-100 pl-1vw pr-1vw mb-1vh'></div>")
    let displayColorLabel = $("<label class='custom-label ml-1vw d-inline' for='" + colorVar + "'>" + displayColorName + "</label>");
    let displayColorInput = $("<input type='color' id='" + colorVar + "' value='" + color + "'/>");

    displayColorBlock.append(displayColorInput);
    displayColorBlock.append(displayColorLabel);

    displayColorInput.on('input', () => {
        rootStyles.setProperty("--" + colorVar, displayColorInput.val());
        styles[colorVar] = displayColorInput.val();
        localStorage.setItem("styles", JSON.stringify(styles));
        console.log(styles);
    });

    return displayColorBlock;
}

function menuToggle(menu, subMenu, toggle) {
    for (let tgl of toggle) {
        $(tgl).click(() => {
            menu.toggleClass("d-none");
            subMenu.toggleClass("d-none");
        });
    }
}

function createClearStyles() {
    styles = {};
    localStorage.setItem("styles", JSON.stringify(styles));
}

function buildModal(modalId, headerText, body) {
    let modal = $(`
        <div class="modal fade" id="modal-` + modalId + `" tabindex="-1" role="dialog" aria-hidden="true">
            <div class="modal-dialog" role="document">
                <div class="modal-content bg-custom">
                    <div class="modal-header text-center d-block">
                        <h5 class="modal-title">` + headerText + `</h5>
                    </div>
                    <div class="modal-body" id="modal-body-` + modalId + `">
                        
                    </div>
                </div>
            </div>
        </div>
    `);
    modal.find("#modal-body-" + modalId).append(body);
    return modal;
}

function getErrorP(id) {
    return $("<p class='error text-center' id='" + id + "Error'></p>");
}