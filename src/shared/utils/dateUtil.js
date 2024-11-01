/**
 * Independent time operation tool to facilitate subsequent switch to dayjs
 */
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';

dayjs.extend(customParseFormat);

/**
 * 连接符
 */
export const CONNECTOR = {
    HORIZONTAL_BAR: '-',
    SLASH_BAR: '/',
    COLON: ':',
    SPACE: ' '
}

export const FORMATS = {
    YYYY: 'YYYY',
    MM: 'MM',
    DD: 'DD',
    HH: 'HH',
    mm: 'mm',
    ss: 'ss',
}

// date_format: 'YYYY-MM-DD'
export const DATE_FORMAT = `${FORMATS.YYYY}${CONNECTOR.HORIZONTAL_BAR}${FORMATS.MM}${CONNECTOR.HORIZONTAL_BAR}${FORMATS.DD}`;

// date_time_format: 'YYYY-MM-DD HH:mm:ss'
export const DATE_TIME_FORMAT = `${FORMATS.YYYY}${CONNECTOR.HORIZONTAL_BAR}${FORMATS.MM}${CONNECTOR.HORIZONTAL_BAR}${FORMATS.DD}${CONNECTOR.SPACE}${FORMATS.HH}${CONNECTOR.COLON}${FORMATS.mm}${CONNECTOR.COLON}${FORMATS.ss}`;

// time_format: 'HH:mm:ss'
export const TIME_FORMAT = `${FORMATS.HH}${CONNECTOR.COLON}${FORMATS.mm}${CONNECTOR.COLON}${FORMATS.ss}`;


/**
 * 格式化成 年月日时分秒
 * @param date
 * @param format
 * @returns
 */
export function formatToDateTime(date, format = DATE_TIME_FORMAT) {
    return dayjs(date).format(format);
}

/**
 * 格式化成 年月日
 * @param date
 * @param format
 * @returns
 */
export function formatToDate(date, format = DATE_FORMAT) {
    return dayjs(date).format(format);
}

/**
 * 格式化成 时分秒
 * @param date
 * @param format
 * @returns
 */
export function formatToTime(date, format = TIME_FORMAT) {
    return dayjs(date).format(format);
}

/**
 * 校验值是否是日期类型
 * @param {*} date 
 * @returns 
 */
export function isValid(date) {
    if (typeof date === 'boolean') {
        return false;
    }
    return dayjs(date, true).isValid();
}