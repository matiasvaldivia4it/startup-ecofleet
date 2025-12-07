// RUT Validation and Formatting
export const validateRUT = (rut) => {
    // Remove dots and hyphens
    const cleanRut = rut.replace(/\./g, '').replace(/-/g, '');

    // Check if it's empty or too short
    if (!cleanRut || cleanRut.length < 2) {
        return false;
    }

    // Separate number and verification digit
    const rutNumber = cleanRut.slice(0, -1);
    const verificationDigit = cleanRut.slice(-1).toUpperCase();

    // Check if rutNumber is a valid number
    if (!/^\d+$/.test(rutNumber)) {
        return false;
    }

    // Calculate verification digit
    let sum = 0;
    let multiplier = 2;

    for (let i = rutNumber.length - 1; i >= 0; i--) {
        sum += parseInt(rutNumber[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }

    const expectedDigit = 11 - (sum % 11);
    let calculatedDigit;

    if (expectedDigit === 11) {
        calculatedDigit = '0';
    } else if (expectedDigit === 10) {
        calculatedDigit = 'K';
    } else {
        calculatedDigit = expectedDigit.toString();
    }

    return verificationDigit === calculatedDigit;
};

// Format RUT with dots and hyphen
export const formatRUT = (rut) => {
    // Remove all non-alphanumeric characters
    const cleanRut = rut.replace(/[^0-9kK]/g, '');

    if (cleanRut.length <= 1) {
        return cleanRut;
    }

    // Separate number and verification digit
    const rutNumber = cleanRut.slice(0, -1);
    const verificationDigit = cleanRut.slice(-1).toUpperCase();

    // Add dots every 3 digits from right to left
    const formattedNumber = rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

    return `${formattedNumber}-${verificationDigit}`;
};

// Chilean Phone Number Validation
export const validateChileanPhone = (phone) => {
    // Remove all non-numeric characters except +
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    // Chilean phone numbers can be:
    // +56912345678 (mobile with country code)
    // 912345678 (mobile without country code)
    // +56221234567 (landline with country code)
    // 221234567 (landline without country code)

    // Check if it starts with +56
    if (cleanPhone.startsWith('+56')) {
        const number = cleanPhone.substring(3);
        // Mobile: 9 digits starting with 9
        // Landline: 9 digits starting with 2
        return /^[29]\d{8}$/.test(number);
    }

    // Without country code
    return /^[29]\d{8}$/.test(cleanPhone);
};

// Format Chilean Phone Number
export const formatChileanPhone = (phone) => {
    const cleanPhone = phone.replace(/[^\d+]/g, '');

    if (cleanPhone.startsWith('+56')) {
        const number = cleanPhone.substring(3);
        if (number.length <= 1) return `+56 ${number}`;
        if (number.length <= 5) return `+56 ${number.substring(0, 1)} ${number.substring(1)}`;
        return `+56 ${number.substring(0, 1)} ${number.substring(1, 5)} ${number.substring(5, 9)}`;
    }

    if (cleanPhone.length <= 1) return cleanPhone;
    if (cleanPhone.length <= 5) return `${cleanPhone.substring(0, 1)} ${cleanPhone.substring(1)}`;
    return `${cleanPhone.substring(0, 1)} ${cleanPhone.substring(1, 5)} ${cleanPhone.substring(5, 9)}`;
};

// Email Validation
export const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

// Required Field Validation
export const validateRequired = (value) => {
    if (typeof value === 'string') {
        return value.trim().length > 0;
    }
    return value !== null && value !== undefined;
};

// Date Validation (must be 18 years or older)
export const validateAge = (dateString) => {
    const birthDate = new Date(dateString);
    const today = new Date();
    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        return age - 1 >= 18;
    }

    return age >= 18;
};

// License Plate Validation (Chilean format: ABCD12 or AB1234)
export const validateLicensePlate = (plate) => {
    const cleanPlate = plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();
    // Old format: AB1234 (2 letters, 4 numbers)
    // New format: ABCD12 (4 letters, 2 numbers)
    return /^[A-Z]{2}\d{4}$/.test(cleanPlate) || /^[A-Z]{4}\d{2}$/.test(cleanPlate);
};

// Format License Plate
export const formatLicensePlate = (plate) => {
    return plate.replace(/[^A-Z0-9]/gi, '').toUpperCase();
};
