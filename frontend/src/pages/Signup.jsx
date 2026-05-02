import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { registerUser } from '../services/authService';
import SpendIQLogo from '../assets/spendiq-logo.png';
import SEO from '../components/SEO';

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Required'),
      email: Yup.string().email('Invalid email address').required('Required'),
      password: Yup.string().min(6, 'Must be at least 6 characters').required('Required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Required'),
    }),
    onSubmit: async (values) => {
      setLoading(true);
      try {
        await registerUser({
          name: values.name,
          email: values.email,
          password: values.password,
        });
        toast.success('Registration successful! Please login.');
        navigate('/login');
      } catch (err) {
        toast.error(err.response?.data?.message || 'Registration failed');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="bg-background min-h-screen flex items-center justify-center p-xl">
      <SEO 
        title="Sign Up" 
        description="Join SpendIQ today. Start tracking your expenses, manage your wealth securely, and achieve financial peace of mind." 
      />
      <div className="w-full max-w-[1280px] flex flex-col md:flex-row gap-[3rem] items-center justify-center">
        {/* Illustration Area (Left on Desktop) */}
        <div className="hidden md:flex flex-1 flex-col justify-center items-center p-xl max-w-[500px]">
          <div className="relative w-full aspect-square rounded-[3rem] clay-card flex items-center justify-center overflow-hidden">
            <img
              alt="Person managing finances"
              className="w-full h-full object-cover opacity-80 mix-blend-multiply"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAcyyxOJuOLE2KkmiEQ2OPqeW31tu1RP7fFmLCpcgEcatUTx0wdqB8FKqY4-N-BSHZR-3gKshQyARfF3x3YuFtwHThmojJRuc13YUkcDkR5GwrPxdI-AP4rjcnLna6MlCk4pZmJm7wvBNtYgXC5Li1cP5TYnsBQDyXk7BtB81-rl1IQd3SzfKuoGZJKBJhe-9gKW8KrKoF3oTtsxDRLZyDwwteZz6XJHF2wNuXAaScAssSFs9tF1z5MxYG_d73Myfz7NsAeo_BZjTY"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-surface/40 to-transparent"></div>
          </div>
          <div className="mt-xl text-center w-full">
            <h2 className="font-headline-lg text-headline-lg text-primary mb-md">Join Friendly Finance</h2>
            <p className="font-body-md text-body-md text-on-surface-variant max-w-[300px] mx-auto">
              Start managing your wealth today. Secure, intuitive, and designed for your peace of mind.
            </p>
          </div>
        </div>
        {/* Signup Form Area (Right on Desktop, Full on Mobile) */}
        <div className="w-full md:w-[400px] shrink-0">
          <div className="clay-card rounded-2xl p-[2rem] flex flex-col gap-lg">
            {/* Header */}
            <div className="text-center mb-sm flex flex-col items-center">
              <div className="flex items-center gap-sm mb-sm justify-center">
                <img src={SpendIQLogo} alt="SpendIQ Logo" className="h-10 w-auto object-contain" />
                <h1 className="text-2xl font-black text-primary italic tracking-tight">SpendIQ</h1>
              </div>
              <p className="font-body-md text-body-md text-on-surface-variant">Create your account</p>
            </div>
            {/* Form */}
            <form onSubmit={formik.handleSubmit} className="flex flex-col gap-md">
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface ml-sm" htmlFor="name">Full Name</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant">person</span>
                  <input
                    className="clay-input w-full rounded-full py-md pl-12 pr-md font-body-md text-body-md text-on-surface placeholder:text-outline-variant"
                    id="name"
                    name="name"
                    placeholder="John Doe"
                    type="text"
                    value={formik.values.name}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                </div>
                {formik.touched.name && formik.errors.name && (
                  <span className="text-error font-label-sm ml-sm">{formik.errors.name}</span>
                )}
              </div>
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
                <label className="font-label-md text-label-md text-on-surface ml-sm" htmlFor="password">Password</label>
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
              <div className="flex flex-col gap-xs">
                <label className="font-label-md text-label-md text-on-surface ml-sm" htmlFor="confirmPassword">Confirm Password</label>
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-md top-1/2 -translate-y-1/2 text-outline-variant">lock</span>
                  <input
                    className="clay-input w-full rounded-full py-md pl-12 pr-12 font-body-md text-body-md text-on-surface placeholder:text-outline-variant"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="••••••••"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formik.values.confirmPassword}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-md top-1/2 -translate-y-1/2 text-outline-variant hover:text-on-surface transition-colors focus:outline-none"
                  >
                    <span className="material-symbols-outlined">
                      {showConfirmPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
                {formik.touched.confirmPassword && formik.errors.confirmPassword && (
                  <span className="text-error font-label-sm ml-sm">{formik.errors.confirmPassword}</span>
                )}
              </div>
              <button
                className="clay-btn-primary rounded-full py-md px-lg w-full font-label-md text-label-md text-on-primary-container mt-sm flex items-center justify-center gap-sm disabled:opacity-70 disabled:cursor-not-allowed"
                type="submit"
                disabled={loading}
              >
                <span>{loading ? 'Signing Up...' : 'Sign Up'}</span>
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
            </div>
            {/* Footer */}
            <div className="text-center mt-sm">
              <p className="font-body-md text-body-md text-on-surface-variant">
                Already have an account?{' '}
                <Link className="font-label-md text-label-md text-primary hover:text-primary-container" to="/login">
                  Log in here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;

