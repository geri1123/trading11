import { useRouter } from 'next/navigation';

const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      await axios.post('/api/auth/cookie/logout'); // 🚀 Call the logout API

      // Optionally remove token manually if you're using js-cookie
      Cookies.remove('token');

      // Redirect to login or home page
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return logout;
};