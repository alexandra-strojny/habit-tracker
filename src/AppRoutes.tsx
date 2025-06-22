import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Dashboard } from './dashboard/Dashboard';
import { Login } from './login/Login';
import { useAuthUser } from './dao/useAuthUser';

export const AppRoutes = () => {
  const { user } = useAuthUser();
  return (
    <Router>
      <Routes>
        {user && user.uid ? (<>
          <Route path="/dashboard" element={<Dashboard />} />
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