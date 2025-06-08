import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
const useLogout = () => {
    const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post('/api/auth/cookie/logout');

      Cookies.remove('token');

    
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return logout;
};