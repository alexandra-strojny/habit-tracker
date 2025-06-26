import React, { useState } from 'react';
import { PrimaryButton } from '../components/PrimaryButton';
import { useCreateUser } from '../dao/useCreateUser';

export const SignUpForm = ({onSwitch}: {onSwitch:()=>void}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const createUserMutation = useCreateUser();
  
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    createUserMutation.mutate({ email, password });
  };

  return (
    <div className="flex justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Sign up</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2" htmlFor="password">
              Confirm Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded"
              required
            />
          </div>
          <PrimaryButton>Sign up</PrimaryButton>
          <button
            type="button"
            onClick={() => onSwitch()}
            className="flex text-primary-blue-green text-sm hover:underline mt-4 cursor-pointer"
          >
            Already have an account? Log in
          </button>
        </form>
      </div>
    </div>
  );
};