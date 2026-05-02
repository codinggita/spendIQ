import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { loginStart, loginSuccess, loginFailure } from '../features/auth/authSlice';
import { loginUser } from '../services/authService';
import SpendIQLogo from '../assets/spendiq-logo.png';
import MoneyStressSVG from '../assets/Money stress-pana.svg';
import SEO from '../components/SEO';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
    }),
    onSubmit: async (values) => {
      dispatch(loginStart());
      try {
        const response = await loginUser(values);
        const token = response?.token || 'dummy-token';
        const user = response?.user || { email: values.email };

        dispatch(loginSuccess({ token, user }));
        toast.success('Login successful!');
        navigate('/dashboard');
      } catch (err) {
        dispatch(loginFailure(err.message || 'Login failed'));
        toast.error(err.response?.data?.message || 'Invalid credentials or API error');
      }
    },
  });

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-xl">
      <SEO 
        title="Login" 
        description="Sign in to your SpendIQ account to manage your expenses, scan receipts, and monitor your financial health." 
      />
      <div className="w-full max-w-[1280px] flex flex-col md:flex-row gap-[3rem] items-center justify-center">
        {/* Illustration Area (Left on Desktop) */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-center p-xl max-w-[520px]">
          <div className="relative w-full flex items-center justify-center">
            <img
              src={MoneyStressSVG}
              alt="Money stress illustration"
              className="w-full max-w-[420px] drop-shadow-xl"
            />
          </div>
          <div className="mt-lg text-center w-full">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-md leading-tight">
              Stressed About <br />
              <span className="text-on-background">Money Management?</span>
            </h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-[320px] mx-auto">
              Take a deep breath. SpendIQ tracks every rupee automatically — so you can stop worrying and start saving.
            </p>
            <div className="flex items-center justify-center gap-sm mt-md">
              <div className="w-2 h-2 rounded-full bg-primary"></div>
              <div className="w-2 h-2 rounded-full bg-primary/40"></div>
              <div className="w-2 h-2 rounded-full bg-primary/20"></div>
            </div>
          </div>
        </div>
        {/* Login Form Area (Right on Desktop, Full on Mobile) */}
        <div className="w-full md:w-[400px] shrink-0">
          <div className="clay-card rounded-2xl p-[2rem] flex flex-col gap-lg">
            {/* Header */}
            <div className="text-center mb-sm flex flex-col items-center">
              <div className="flex items-center gap-sm mb-sm justify-center">
                <img src={SpendIQLogo} alt="SpendIQ Logo" className="h-10 w-auto object-contain" />
                <h1 className="text-2xl font-black text-primary italic tracking-tight">SpendIQ</h1>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Sign in to your account</p>
            </div>
            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-md">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface ml-sm" htmlFor="email">Email Address</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant">mail</span>
                  <input
                    className="clay-input w-full rounded-full py-md pl-12 pr-md font-body-md text-body-md text-on-surface placeholder:text-outline-variant"
                    id="email"
                    name="email"
                    placeholder="you@example.com"
                    type="email"
                    value={formik.values.email}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.email && formik.errors.email && (
                  <span className="text-error font-label-sm ml-sm">{formik.errors.email}</span>
                )}
              </div>
              <div className="flex flex-col gap-xs">
                <div className="flex justify-between items-center ml-sm mr-sm">
                  <label className="font-label-md text-label-md text-on-surface" htmlFor="password">Password</label>
                  <a className="font-label-sm text-label-sm text-primary hover:text-primary-container" href="#">Forgot?</a>
                </div>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
                  <input
                    className="clay-input w-full rounded-full py-md pl-12 pr-12 font-body-md text-body-md text-on-surface placeholder:text-outline-variant"
                    id="password"
                    name="password"
                    placeholder="••••••••"
                    type={showPassword ? 'text' : 'password'}
                    value={formik.values.password}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-md top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors focus:outline-none"
                  >
                    <span className="material-symbols-outlined">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {formik.touched.password && formik.errors.password && (
                  <span className="text-error font-label-sm ml-sm">{formik.errors.password}</span>
                )}
              </div>
              <button
                className="clay-btn-primary rounded-full py-md px-lg w-full font-label-md text-label-md text-on-primary-container mt-sm flex items-center justify-center gap-sm disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? 'Logging In...' : 'Log In'}</span>
                {!loading && <span className="material-symbols-outlined text-[18px]">arrow_forward</span>}
              </button>
            </form>
            {/* Divider */}
            <div className="flex items-center gap-sm my-xs">
              <div className="flex-1 h-px bg-outline-variant/30"></div>
              <span className="font-label-sm text-label-sm text-outline">OR</span>
              <div className="flex-1 h-px bg-outline-variant/30"></div>
            </div>
            {/* Social Login */}
            <div className="flex flex-col gap-sm">
              <button
                className="clay-btn-secondary rounded-full py-sm px-lg w-full font-label-md text-label-md text-on-surface flex items-center justify-center gap-md"
                type="button"
              >
                <img
                  alt="Google"
                  className="w-5 h-5"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDds99qBphd_rnXd1JX_7RS3p503D8RtuLQdNQhVtTowk0Ar6wAXU6CuLJ_04D7Kw_Y9fW2fXtliKiYmfccw89e9RHs_uaZUbPmj_VZ3nysuIB1v9N8l53fbvlsVCAhAZGF50nCVtyCpQBMNjcCFpXieBQe8sPLRkEIkm6J9AvOZ4ExHrd_p7YjSWMEV4XX8i4M2yPsObWohqEtTvzSHC1wIFkJ6w6gQuORiF3MRmHddQ9mmlJcyEjOib5ONki66aGpbLDYSQk-eYc"
                />
                Continue with Google
              </button>
              <button
                className="clay-btn-secondary rounded-full py-sm px-lg w-full font-label-md text-label-md text-on-surface flex items-center justify-center gap-md"
                type="button"
              >
                <img
                  alt="GitHub"
                  className="w-5 h-5 opacity-80"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuA7fad0O-rfN93aUydFFKAVc08VHvuE6xoJMXcl2nszwd6HKfaaIU2heYaUbhM2VSwcLXlo2x6SS4qMjLFiY_XExAOA0lHmqBTPxhP60TBqHj2brQaDsOg1oU_15ARmoTdxPVsO_epaLncjhQQhaNeVbCPh9N3kJS88nTm46Io7ONy44vJ813jJQXOVpZNKVoVTOaF0Alusee9orjJkqPYmMU2-ZBb-R5I5eKibkOxZ0MUSAfDSKmBOmxNUwxT7vqYRZQoPPgwgCAo"
                />
                Continue with GitHub
              </button>
            </div>
            {/* Footer */}
            <div className="text-center mt-sm">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Don't have an account?{' '}
                <Link className="font-label-md text-label-md text-primary hover:text-primary-container" to="/signup">
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

