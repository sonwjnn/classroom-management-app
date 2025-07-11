export const generateAccessCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const formatPhoneNumber = (phoneNumber: string) => {
  const cleaned = phoneNumber.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+1${cleaned}`; // Default to US
  } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+${cleaned}`;
  } else if (cleaned.startsWith("+")) {
    return cleaned;
  } else {
    return `+${cleaned}`;
  }
};
