/**
 * @description: Request result set
 */
export const RESULT_ENUM = {
    SUCCESS: 0,
    ERROR: -1,
    TIMEOUT: 401,
    TYPE: 'success',
}

/**
 * @description: request method
 */
export const REQUEST_ENUM = {
    GET: 'GET',
    POST: 'POST',
    PUT: 'PUT',
    DELETE: 'DELETE',
}

/**
 * @description:  contentType
 */
export const CONTENT_TYPE_ENUM = {
    // json
    JSON: 'application/json;charset=UTF-8',
    // form-data qs
    FORM_URLENCODED: 'application/x-www-form-urlencoded;charset=UTF-8',
    // form-data  upload
    FORM_DATA: 'multipart/form-data;charset=UTF-8',
}