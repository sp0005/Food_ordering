import { useState } from 'react';
import { FiMail, FiLock } from 'react-icons/fi';
import * as Yup from 'yup';
import axios from 'axios';

// Validation  Yup
const AdminLoginSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      'Password must contain at least one uppercase, one lowercase, one number, and one special character'
    ),
});

const AdminLogin = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    console.log(`Changed ${name} to: ${value}`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await AdminLoginSchema.validate(formData, { abortEarly: false });
      setErrors({});
      setLoginError('');
      console.log('Sending data:', formData);

      const response = await axios.post('http://localhost/api/admin-login.php', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log('Response:', response.data);
      if (response.data.success) {
        localStorage.setItem('adminToken', response.data.token);
        window.location.href = '/admin-dashboard';
      } else {
        setLoginError(response.data.message || 'Invalid credentials');
      }
    } catch (err) {
      setLoginError('An error occurred. Please try again.');
      if (err.response) {
        console.error('Server Response:', err.response.data);
        console.error('Status:', err.response.status);
      } else if (err.request) {
        console.error('No Response:', err.request);
      } else {
        console.error('Error:', err.message);
      }
      console.error('Full Error:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold text-center text-gray-900 flex items-center justify-center mb-6">
          <FiLock className="mr-2" /> Admin Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <div className="mt-1 relative">
              <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input id="email" name="email" type="email"
                value={formData.email}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                placeholder="admin@example.com"/>
            </div>
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="mt-1 relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                className={`block w-full pl-10 pr-3 py-2 border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } rounded-md focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm`}
                placeholder="********" />
            </div>
            {errors.password && <p className="mt-1 text-sm text-red-500">{errors.password}</p>}
          </div>

          <div>
            <button type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white py-2 px-4 rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500" >
              Login </button>
          </div>
          {loginError && <p className="mt-2 text-sm text-red-500 text-center">{loginError}</p>}
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Back to{' '}
          <a href="/" className="text-orange-500 hover:text-orange-600 font-medium">
            Home </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;