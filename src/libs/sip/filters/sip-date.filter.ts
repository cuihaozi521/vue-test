export const sipDate = function (value) {
    if (!value) return ''
    value = value.toString()
    return value.split(' ')[0];
};