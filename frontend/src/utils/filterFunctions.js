export const filterStringField = (stringField, string) =>
    stringField ? string.includes(stringField) : true;

export const filterRangeField = (rangeField, data) => {
    if (rangeField.from && !rangeField.to && data < rangeField.from) {
        return false;
    }

    if (rangeField.to && !rangeField.from && data > rangeField.to) {
        return false;
    }

    if (
        rangeField.from &&
        rangeField.to &&
        (data < rangeField.from || data > rangeField.to)
    ) {
        return false;
    }
    return true;
};

export const filterBooleanField = (booleanField, array, condition) =>
    booleanField ? array.find(condition) : true;
