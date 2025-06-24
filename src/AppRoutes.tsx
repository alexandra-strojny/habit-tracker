import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Dashboard } from './dashboard/Dashboard';
import { Login } from './login/Login';
import { useAuthUser } from './dao/useAuthUser';
import { Menu } from './Menu';
import { AllHabits } from './all-habits/AllHabits';
import { DetailedHabit } from './habit/DetailedHabit';

export const AppRoutes = () => {
  const user = useAuthUser();
  return (
    <Router>
      <Menu />
      <Routes>
        {user && user.uid ? (<>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/all-habits" element={<AllHabits />} />
          <Route path="/habits/:habitId" element={<DetailedHabit />} />
          <Route path="*" element={<Navigate to="/dashboard" />} /></> 
        ) : (<>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
    </Router>
  );
};