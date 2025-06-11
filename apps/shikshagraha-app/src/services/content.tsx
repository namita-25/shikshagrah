import axios from 'axios';

export const getContentDetails = async (
  identifier?: string | string[]
): Promise<any> => {
  const apiUrl = `${process.env.NEXT_PUBLIC_MIDDLEWARE_URL}/api/content/v1/read/${identifier}`;

  try {
    const response = await axios.get(apiUrl);
    return response?.data;
  } catch (error) {
    console.error('error in fetching user details', error);
    return error;
  }
};
