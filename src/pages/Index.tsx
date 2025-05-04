
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import HomePage from './HomePage';

const Index = () => {
  return (
    <>
      <HomePage />
      <BottomNavigation />
    </>
  );
};

export default Index;
