// Function to generate a 6-digit OTP
export const generateOtp = (): string => {
  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // Return the OTP
  return otp;
};
