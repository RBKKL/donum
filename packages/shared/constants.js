export const APP_NAME = "Donum";
export const CONTRACT_NAME = "DonationsStore";
export const SIGN_IN_MESSAGE = "This will cost you nothing\nBelow is the technical information";
export const MESSAGE_MAX_LENGTH = 256;
export const NICKNAME_MIN_LENGTH = 3;
export const NICKNAME_MAX_LENGTH = 64;
export const DESCRIPTION_MAX_LENGTH = 1024;
export const avatarAcceptableFileExtensions = "image/png, image/gif, image/jpeg";
export var SessionStatus;
(function (SessionStatus) {
    SessionStatus["UNAUTHENTICATED"] = "unauthenticated";
    SessionStatus["AUTHENTICATED"] = "authenticated";
    SessionStatus["LOADING"] = "loading";
})(SessionStatus || (SessionStatus = {}));
export const DEFAULT_ADDRESS = "0xAC0772000aa52CbF8a8dB501cC8caC03cDF01bf6";
