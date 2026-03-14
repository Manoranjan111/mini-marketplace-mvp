import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Mail, Lock, EyeOff } from 'lucide-react';
import { toast } from 'react-toastify';
import { signup } from '@/services';
import { decryptPayload } from '@/lib/utils';
import BeatLoadingAnimation from '@/components/loading-animation';

const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupPage = () => {
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      setLoading(true);
      const res = await signup(
        {
          name: data.name,
          email: data.email,
          password: data.password,
        }
      );
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
      console.log(res)
      const payload = decryptPayload(res.data);
      localStorage.setItem('email', payload?.email || '');
      toast.success("Signup and login successful!");
      window.location.href = '/dashboard';
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false)
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      {loading && <BeatLoadingAnimation resion="Signing up..." />}
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-8">Create an Account</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                {...register('name')}
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Enter full Name"
              />
            </div>
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
          </div>

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

          {/* Confirm Password Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
            <div className="relative">
              <EyeOff className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                {...register('confirmPassword')}
                type="password"
                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="********"
              />
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg transition duration-200 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;