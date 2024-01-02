import { DEVICE_TYPE } from "@/constants/enum";

export function isMobile(uaType: DEVICE_TYPE) {
    return uaType === DEVICE_TYPE.Android || uaType === DEVICE_TYPE.IOS;
}

export function isIOS(uaType: DEVICE_TYPE) {
    return uaType === DEVICE_TYPE.IOS;
}

export function isAndroid(uaType: DEVICE_TYPE) {
    return uaType === DEVICE_TYPE.Android;
}