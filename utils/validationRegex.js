// Regex to allow up to two decimal places
export const maxTwoDecimalPlaces = /^[0-9]+(\.[0-9]{1,2})?$/;

// Regex to match numbers with up to 4 digits,
export const uptoFourDigitRegex = /^[1-9][0-9]{0,3}$/;

// Matches numbers up to 5 digits, not starting with 0
export const uptoFiveDigitRegex = /^[1-9][0-9]{0,4}$/;

// Regex to validate non-decimal integers up to 15 digits
export const integerUpTo15DigitsRegex = /^[0-9][0-9]{0,14}$/;

// Matches only positive integers
export const integerRegex = /^\d+$/;

export const positiveIntegerRegex = /^[1-9]\d*$/;
// Matches positive integers greater than 0

// Matches exactly 10 digits
export const mobileLengthRegex = /^[0-9]{10}$/;

// Ensures no leading zero
export const mobileNoLeadingZeroRegex = /^[1-9][0-9]*$/;

// alphanumeric regex
export const alphanumericRegex = /^[a-zA-Z0-9]+$/;

export const alphanumericWithHyphenUnderscoreRegex = /^[a-zA-Z0-9_-]+$/;
// Matches alphanumeric strings and allows hyphens (`-`) and underscores (`_`)

// Matches exactly 12 digits and does not start with 0
export const aadhaarRegex = /^(?!0)\d{12}$/;

// Matches the PAN format
export const panRegex = /^[A-Z]{5}\d{4}[A-Z]{1}$/;
