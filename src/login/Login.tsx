import{ useState } from 'react';
import { LoginForm } from './LoginForm';
import { SignUpForm } from './SignUpForm';

export const Login = () => {
  const [signUp, setSignUp] = useState(false);

  return signUp ? 
    (<SignUpForm onSwitch={()=>setSignUp(false)} />) :
    (<LoginForm onSwitch={() => setSignUp(true)} />);
};