let currentColorScheme = getDarkColorScheme();

document.addEventListener('DOMContentLoaded', () => {
    console.log(currentColorScheme);
    Object.keys(currentColorScheme).forEach((colorVar) =>
        rootStyles.setProperty("--" + colorVar, currentColorScheme[colorVar])
    );
});

function getCurrentColorScheme() {
    return currentColorScheme;
}

function setCurrentColorScheme(theme = "Retro") {
    currentColorScheme =
        theme === "Retro" ? getRetroColorScheme() :
        theme === "Dark" ? getDarkColorScheme() :
        getLightColorScheme();
}

function getRetroColorScheme() {
    return {
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
        'text-color-button-theme': '#000000',
    };
}

function getDarkColorScheme() {
    return {
        'background-color-side-menu': '#162447',
        'background-color-chat': '#162447',
        'text-color-main': '#ffffff',
        'text-color-chat': '#ffffff',
        'background-color-mine-message': '#0f4075',
        'background-color-yours-message': '#29739f',
        'scroll-color': '#1f4298',
        'background-color-side-menu-logo': '#1f4068',
        'text-color-menu-toggle': '#263f77',
        'text-color-menu-toggle-hover': '#2e4d8d',
        'text-color-link': '#ff99f3',
        'text-color-link-hover': '#ff5cec',
        'link-color-before': '#ff5cec',
        'background-color-button': '#b9925e',
        'text-color-button': '#ffffff',
        'border-color-button': '#b9925e',
        'border-color-button-hover': '#ffffff',
        'background-color-checkbox-mark': '#ffffff',
        'background-color-checkbox-mark-checked': '#6af321',
        'background-color-textarea': '#0d1b3f',
        'text-color-textarea': '#ffffff',
        'background-color-header': '#0d1b3f',
        'text-color-chat-name-header': '#ffffff',
        'background-color-login-span-or': '#efac53',
        'text-color-login-span-or': '#ffffff',
        'text-color-error-message': '#ff0000',
        'border-color-input-error': '#ff0000',
        'background-color-input-error': '#ffa1a1',
        'background-color-form-body': '#0d1b3f',
        'text-block-color-send-button': '#0d1b3f',
        'send-button-color': '#263f77',
        'text-color-button-theme': '#ffffff',
    };
}

function getLightColorScheme() {
    return {
        'background-color-side-menu': '#e6e6ea',
        'background-color-chat': '#e6e6ea',
        'text-color-main': '#000000',
        'text-color-chat': '#ffffff',
        'background-color-mine-message': '#ffb61b',
        'background-color-yours-message': '#2ab7ca',
        'scroll-color': '#1f4298',
        'background-color-side-menu-logo': '#1f4068',
        'text-color-menu-toggle': '#228d9d',
        'text-color-menu-toggle-hover': '#30daf1',
        'text-color-link': '#16b7ca',
        'text-color-link-hover': '#30daf1',
        'link-color-before': '#30daf1',
        'background-color-button': '#b9925e',
        'text-color-button': '#ffffff',
        'border-color-button': '#b9925e',
        'border-color-button-hover': '#ffffff',
        'background-color-checkbox-mark': '#ffffff',
        'background-color-checkbox-mark-checked': '#6af321',
        'background-color-textarea': '#2ab7ca',
        'text-color-textarea': '#ffffff',
        'background-color-header': '#2ab7ca',
        'text-color-chat-name-header': '#ffffff',
        'background-color-login-span-or': '#efac53',
        'text-color-login-span-or': '#ffffff',
        'text-color-error-message': '#ff0000',
        'border-color-input-error': '#ff0000',
        'background-color-input-error': '#ffa1a1',
        'background-color-form-body': '#2ab7ca',
        'text-block-color-send-button': '#2ab7ca',
        'send-button-color': '#0993a2',
        'text-color-button-theme': '#000000',
    };
}