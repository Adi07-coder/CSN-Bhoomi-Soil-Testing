import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../hooks/useAuth';
import { Leaf, Eye, EyeOff, UserPlus, AlertCircle, CheckCircle2 } from 'lucide-react';

const schema = z.object({
  full_name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine(d => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
type FormData = z.infer<typeof schema>;

const strength = (pw: string) => {
  let s = 0;
  if (pw.length >= 8) s++;
  if (/[A-Z]/.test(pw)) s++;
  if (/[0-9]/.test(pw)) s++;
  if (/[^A-Za-z0-9]/.test(pw)) s++;
  return s;
};

export default function RegisterPage() {
  const { register: registerUser } = useAuth();
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  const pwValue = watch('password', '');
  const pwStrength = strength(pwValue);

  const onSubmit = async (data: FormData) => {
    setError(null);
    try {
      await registerUser(data.email, data.password, data.full_name);
    } catch (err: any) {
      setError(err?.response?.data?.detail || 'Registration failed. Please try again.');
    }
  };

  const strengthColors = ['', 'bg-red-400', 'bg-amber-400', 'bg-brand-400', 'bg-brand-600'];
  const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-900 to-brand-700 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-card-elevated p-8 animate-slide-up">
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-brand-600 flex items-center justify-center shadow-md mb-3">
              <Leaf className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-display font-bold text-gray-900">Create account</h1>
            <p className="text-sm text-gray-500 mt-1">Start analysing your farm with CSN Bhoomi</p>
          </div>

          {error && (
            <div className="alert alert-error mb-5">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="label">Full name</label>
              <input {...register('full_name')} type="text" autoComplete="name"
                placeholder="Rajesh Patil" className={`input ${errors.full_name ? 'input-error' : ''}`} />
              {errors.full_name && <p className="form-error">{errors.full_name.message}</p>}
            </div>
            <div>
              <label className="label">Email address</label>
              <input {...register('email')} type="email" autoComplete="email"
                placeholder="you@example.com" className={`input ${errors.email ? 'input-error' : ''}`} />
              {errors.email && <p className="form-error">{errors.email.message}</p>}
            </div>
            <div>
              <label className="label">Password</label>
              <div className="relative">
                <input {...register('password')} type={showPw ? 'text' : 'password'}
                  autoComplete="new-password" placeholder="Min. 8 characters"
                  className={`input pr-10 ${errors.password ? 'input-error' : ''}`} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {pwValue && (
                <div className="mt-2 space-y-1">
                  <div className="flex gap-1">
                    {[1,2,3,4].map(i => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${pwStrength >= i ? strengthColors[pwStrength] : 'bg-gray-200'} transition-colors duration-200`} />
                    ))}
                  </div>
                  <p className={`text-xs font-medium ${pwStrength >= 3 ? 'text-brand-600' : 'text-gray-500'}`}>
                    {strengthLabels[pwStrength]}
                  </p>
                </div>
              )}
              {errors.password && <p className="form-error">{errors.password.message}</p>}
            </div>
            <div>
              <label className="label">Confirm password</label>
              <input {...register('confirmPassword')} type="password" autoComplete="new-password"
                placeholder="Re-enter password"
                className={`input ${errors.confirmPassword ? 'input-error' : ''}`} />
              {errors.confirmPassword && <p className="form-error">{errors.confirmPassword.message}</p>}
            </div>

            <div className="alert alert-info text-xs">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
              Your data is stored securely. Farm data is never shared without your consent.
            </div>

            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full btn-lg mt-2">
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : <UserPlus className="w-4 h-4" />}
              {isSubmitting ? 'Creating account…' : 'Create Account'}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-600 font-semibold hover:text-brand-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
