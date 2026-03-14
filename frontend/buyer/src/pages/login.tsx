import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Lock } from 'lucide-react';
import { toast } from 'react-toastify';
import { login } from '@/services';
import { decryptPayload } from '@/lib/utils';
import BeatLoadingAnimation from '@/components/loading-animation';

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
}).strict();

type LoginFormData = z.infer<typeof loginSchema>;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const query = new URLSearchParams(window.location.search);
  const redirectTo = query.get('redirectTo') || '/';

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });


  const onSubmit = async (data: LoginFormData) => {
    try {
      setLoading(true);
      const res = await login({
        email: data.email,
        password: data.password,
        role: "BUYER"
      });
      if (!res.success) {
        if (res.error) {
          toast.error(res.error);
          return
        } else if (Array.isArray(res.errors) && res.errors.length > 0) {
          toast.error(`Error code: ${res.errors[0].code}`);
          return
        } else {
          toast.error("An unknown error occurred");
          return
        }
      }
      const payload = decryptPayload(res.data)
      localStorage.setItem('username', payload?.user?.name || 'Guest');
      toast.success("Login successful!");
      window.location.href = redirectTo;
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {loading && <BeatLoadingAnimation resion="Logging in..." />}
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Login</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                {...register('email')}
                type="email"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="email@example.com"
              />
            </div>
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                {...register('password')}
                type="password"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="********"
              />
            </div>
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Logging In...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;