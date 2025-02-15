import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { validateLogin } from '../utils/Validation';
import { FaEnvelope, FaLock } from 'react-icons/fa';
import { signInService } from '../services/service';
import { useAuth } from '../contexts/authContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const {login, auth} = useAuth();

  useEffect(() => {
    if(auth.isLoggedIn){
      navigate('/home', {replace:true})
    }
  },[])

  const handleSubmit = async(e) => {
    e.preventDefault();
    const newErrors = validateLogin(email, password);
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      try {
        const response = await signInService(email, password)
        if(response.success){
            console.log("Thsi si the response: ", response)
          login(response.userId, response.userName)
          toast.success('Login successful!');
          navigate('/home');
      }
        
      } catch (error) {
        toast.error(error.response.data.message);  
      }
      
    } else {
      setTimeout(() => setErrors({}), 2000);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-200 via-purple-300 to-indigo-400">
      <div className="bg-white/40 backdrop-blur-md shadow-lg p-8 rounded-xl w-full max-w-md border border-white/50">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-2">Welcome Back</h1>
        <h2 className="text-lg text-gray-700 text-center mb-6">Login to Your Account</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
         
          <div className="relative">
            <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            <input
              type="email"
              placeholder="Enter Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-white/80 text-gray-900 placeholder-gray-600 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

         
          <div className="relative">
            <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-600" />
            <input
              type="password"
              placeholder="Enter Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-3 bg-white/80 text-gray-900 placeholder-gray-600 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>

         
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-semibold rounded-lg hover:opacity-80 transition duration-300"
          >
            Login
          </button>

         
          <p
            className="text-gray-700 text-center mt-3 cursor-pointer hover:underline"
            onClick={() => navigate('/signup')}
          >
            Don't have an account? <span className="text-blue-600 font-semibold">Sign Up</span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default Login;
