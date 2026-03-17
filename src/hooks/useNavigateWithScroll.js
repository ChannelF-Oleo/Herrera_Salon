// src/hooks/useNavigateWithScroll.js
import { useNavigate } from 'react-router-dom';

export const useNavigateWithScroll = () => {
  const navigate = useNavigate();

  const navigateWithScroll = (path, options = {}) => {
    navigate(path, options);
    // Pequeño delay para asegurar que la navegación se complete antes del scroll
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  return navigateWithScroll;
};

export default useNavigateWithScroll;