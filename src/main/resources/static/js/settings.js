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
    let settingsMenuProfileToggle = $(".settings-menu-profile-toggle");
    let settingsMenuDisplayToggle = $(".settings-menu-display-toggle");
    let settingsMenu = $("#settings-menu");
    let settingsMenuProfile = $("#settings-menu-profile");
    let settingsMenuDisplay = $("#settings-menu-display");
    let contactMenu = $("#contact-menu");

    menuToggle(menu, contactMenu, contactMenuToggle);
    menuToggle(menu, settingsMenu, settingsMenuToggle);
    menuToggle(settingsMenu, settingsMenuProfile, settingsMenuProfileToggle);
    menuToggle(settingsMenu, settingsMenuDisplay, settingsMenuDisplayToggle);

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