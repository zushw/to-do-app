export function getApiErrorMessage(err) {
  if (err.response && err.response.data) {
    const errorData = err.response.data;

    if (typeof errorData === 'object' && Object.keys(errorData).length > 0) {
      const firstErrorKey = Object.keys(errorData)[0];
      
      const firstErrorMessage = Array.isArray(errorData[firstErrorKey]) 
        ? errorData[firstErrorKey][0] 
        : errorData[firstErrorKey];

      const formattedKey = firstErrorKey.replace(/_/g, ' ').toUpperCase();

      if (firstErrorKey.toLowerCase() === 'detail') {
        return firstErrorMessage;
      }

      return `${formattedKey}: ${firstErrorMessage}`;
    }

    if (typeof errorData === 'string') {
      return errorData;
    }
  }

  return 'An unexpected error occurred. Please try again.';
}