import { useRouter } from 'next/navigation';

const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post('/api/auth/cookie/logout'); // 🚀 Call the logout API

      Cookies.remove('token');

    
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return logout;
};