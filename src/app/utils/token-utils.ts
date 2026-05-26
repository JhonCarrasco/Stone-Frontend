export const decodeToken = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid JWT token format');
    }
    // The payload is the second part (index 1)
    const payload = parts[1];
    // Decode Base64 string and parse as JSON
    const decodedPayload = JSON.parse(window.atob(payload));
    return decodedPayload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};
