export const sizeEnum = {
    XS: 'XS',
    SM: 'SM',
    MD: 'MD',
    LG: 'LG',
    XL: 'XL',
    XXL: 'XXL',
}

export const screenEnum = {
    XS: 320,
    SM: 640,
    MD: 768,
    LG: 960,
    XL: 1280,
    XXL: 1536,
}

/**
 * new Map<SIZE_ENUM, number>()
 */
const screenMap = new Map();

screenMap.set(sizeEnum.XS, screenEnum.XS);
screenMap.set(sizeEnum.SM, screenEnum.SM);
screenMap.set(sizeEnum.MD, screenEnum.MD);
screenMap.set(sizeEnum.LG, screenEnum.LG);
screenMap.set(sizeEnum.XL, screenEnum.XL);
screenMap.set(sizeEnum.XXL, screenEnum.XXL);

export {
    screenMap
};

