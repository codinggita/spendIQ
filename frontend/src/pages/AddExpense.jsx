import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { addExpense } from '../features/expense/expenseSlice';
import { addExpenseApi } from '../services/expenseService';
import { CATEGORIES, PAYMENT_METHODS } from '../utils/constants';

const AddExpense = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      amount: '',
      category: '',
      paymentMethod: '',
      date: new Date().toISOString().split('T')[0],
      notes: '',
    },
    validationSchema: Yup.object({
      amount: Yup.number().positive('Must be a positive number').required('Amount is required').min(0.01, 'Minimum amount is 0.01'),
      category: Yup.string().required('Category is required').oneOf(CATEGORIES),
      paymentMethod: Yup.string().required('Payment method is required').oneOf(PAYMENT_METHODS),
      date: Yup.date().required('Date is required'),
      notes: Yup.string().max(200, 'Notes must be 200 characters or less'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        await addExpenseApi({
          amount: values.amount,
          notes: values.notes,
          category: values.category,
          source: 'Manual',
          date: values.date,
        });
        dispatch(addExpense({ ...values, id: Date.now().toString() }));
        toast.success('Expense added successfully');
        navigate('/expenses');
      } catch (err) {
        console.error('AddExpense error:', err);
        toast.error('Saved locally (backend unavailable)');
        dispatch(addExpense({ ...values, id: Date.now().toString() }));
        navigate('/expenses');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleVoiceInput = () => {
    toast("Voice input feature coming soon!", { icon: "🎙️" });
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center py-6 md:py-12">
      <div className="w-full max-w-2xl relative">
        {/* Back Button */}
        <button 
          onClick={() => navigate('/expenses')}
          className="absolute -top-12 left-0 flex items-center text-label-md text-outline hover:text-primary transition-colors"
        >
          <span className="material-symbols-outlined mr-1 text-[18px]">arrow_back</span> Back to Expenses
        </button>

        {/* Header & Illustration Area */}
        <div className="flex flex-col items-center mb-10 text-center">
          {/* Minimal SVG Illustration */}
          <div className="w-32 h-32 mb-6 relative">
            <div className="absolute inset-0 bg-primary/10 rounded-full blur-2xl"></div>
            <svg className="w-full h-full relative z-10 text-primary drop-shadow-xl" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <rect fill="none" height="40" rx="6" stroke="currentColor" strokeWidth="4" width="60" x="20" y="30"></rect>
              <path d="M80 45H65C62.2386 45 60 47.2386 60 50C60 52.7614 62.2386 55 65 55H80" stroke="currentColor" strokeLinecap="round" strokeWidth="4"></path>
              <circle cx="68" cy="50" fill="currentColor" r="3"></circle>
              <path d="M35 30V20C35 17.2386 37.2386 15 40 15H60C62.7614 15 65 17.2386 65 20V30" stroke="currentColor" strokeLinecap="round" strokeWidth="4"></path>
            </svg>
          </div>
          <h2 className="text-headline-xl font-headline-xl text-on-surface mb-2">New Expense</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">Log your recent transaction</p>
        </div>

        {/* Main Clay Form Card */}
        <form onSubmit={formik.handleSubmit} className="bg-surface rounded-[40px] p-8 md:p-12 clay-card flex flex-col gap-8 relative z-20">
          
          {/* Amount Input (Large Recessed) */}
          <div className="flex flex-col gap-3">
            <label className="text-label-sm font-label-sm text-outline uppercase tracking-wider ml-2">Amount</label>
            <div className="relative flex items-center">
              <span className="absolute left-6 text-headline-md font-headline-md text-primary">$</span>
              <input
                type="number"
                step="0.01"
                {...formik.getFieldProps('amount')}
                className={`w-full h-24 bg-surface-container clay-input-recessed rounded-[24px] pl-14 pr-6 text-[48px] font-bold text-on-surface outline-none border-none focus:ring-2 focus:ring-primary/20 transition-shadow appearance-none ${formik.touched.amount && formik.errors.amount ? 'ring-2 ring-error/50' : ''}`}
                placeholder="0.00" 
                style={{ MozAppearance: 'textfield' }}
              />
            </div>
            {formik.touched.amount && formik.errors.amount && (
              <p className="text-label-sm text-error ml-2">{formik.errors.amount}</p>
            )}
          </div>

          {/* Category & Date Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col gap-3">
              <label className="text-label-sm font-label-sm text-outline uppercase tracking-wider ml-2">Category</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 material-symbols-outlined text-outline">restaurant</span>
                <select
                  {...formik.getFieldProps('category')}
                  className={`w-full h-16 bg-surface-container clay-input-recessed rounded-xl pl-12 pr-10 text-body-md font-body-md text-on-surface outline-none border-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer ${formik.touched.category && formik.errors.category ? 'ring-2 ring-error/50' : ''}`}
                >
                  <option value="" disabled>Select category</option>
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <span className="absolute right-4 material-symbols-outlined text-outline pointer-events-none">expand_more</span>
              </div>
              {formik.touched.category && formik.errors.category && (
                <p className="text-label-sm text-error ml-2">{formik.errors.category}</p>
              )}
            </div>

            <div className="flex flex-col gap-3">
              <label className="text-label-sm font-label-sm text-outline uppercase tracking-wider ml-2">Date</label>
              <div className="relative flex items-center">
                <span className="absolute left-4 material-symbols-outlined text-outline">calendar_today</span>
                <input
                  type="date"
                  {...formik.getFieldProps('date')}
                  className={`w-full h-16 bg-surface-container clay-input-recessed rounded-xl pl-12 pr-6 text-body-md font-body-md text-on-surface outline-none border-none cursor-pointer focus:ring-2 focus:ring-primary/20 ${formik.touched.date && formik.errors.date ? 'ring-2 ring-error/50' : ''}`}
                />
              </div>
              {formik.touched.date && formik.errors.date && (
                <p className="text-label-sm text-error ml-2">{formik.errors.date}</p>
              )}
            </div>
          </div>

          {/* Payment Method */}
          <div className="flex flex-col gap-3">
            <label className="text-label-sm font-label-sm text-outline uppercase tracking-wider ml-2">Payment Method</label>
            <div className="relative flex items-center">
              <span className="absolute left-4 material-symbols-outlined text-outline">credit_card</span>
              <select
                {...formik.getFieldProps('paymentMethod')}
                className={`w-full h-16 bg-surface-container clay-input-recessed rounded-xl pl-12 pr-10 text-body-md font-body-md text-on-surface outline-none border-none focus:ring-2 focus:ring-primary/20 appearance-none cursor-pointer ${formik.touched.paymentMethod && formik.errors.paymentMethod ? 'ring-2 ring-error/50' : ''}`}
              >
                <option value="" disabled>Select method</option>
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
              </select>
              <span className="absolute right-4 material-symbols-outlined text-outline pointer-events-none">expand_more</span>
            </div>
            {formik.touched.paymentMethod && formik.errors.paymentMethod && (
              <p className="text-label-sm text-error ml-2">{formik.errors.paymentMethod}</p>
            )}
          </div>

          {/* Note Input */}
          <div className="flex flex-col gap-3">
            <label className="text-label-sm font-label-sm text-outline uppercase tracking-wider ml-2">Note (Optional)</label>
            <div className="relative flex items-start pt-4">
              <span className="absolute left-4 top-5 material-symbols-outlined text-outline">edit_note</span>
              <textarea
                {...formik.getFieldProps('notes')}
                className={`w-full bg-surface-container clay-input-recessed rounded-[24px] pl-12 pr-6 py-4 text-body-md font-body-md text-on-surface outline-none border-none resize-none focus:ring-2 focus:ring-primary/20 ${formik.touched.notes && formik.errors.notes ? 'ring-2 ring-error/50' : ''}`}
                placeholder="What was this for?" 
                rows="2"
              ></textarea>
            </div>
            {formik.touched.notes && formik.errors.notes && (
              <p className="text-label-sm text-error ml-2">{formik.errors.notes}</p>
            )}
          </div>

          {/* Action Area (Voice & Submit) */}
          <div className="mt-4 flex flex-col-reverse md:flex-row items-center gap-6">
            {/* Prominent Voice Input Button */}
            <button 
              type="button" 
              onClick={handleVoiceInput}
              aria-label="Voice input" 
              className="w-full md:w-20 h-20 rounded-[32px] md:rounded-full bg-surface text-primary border-2 border-primary/20 flex items-center justify-center flex-shrink-0 group transition-all duration-300 hover:bg-primary-container/10 hover:border-primary/50"
            >
              <span className="material-symbols-outlined text-3xl group-hover:scale-110 transition-transform">mic</span>
              <span className="md:hidden ml-2 font-label-md">Voice Input</span>
            </button>
            
            {/* Main Submit Button */}
            <button 
              type="submit"
              className="w-full flex-1 h-20 rounded-[32px] bg-primary text-on-primary flex items-center justify-center text-headline-md font-headline-md clay-btn-primary transition-all duration-300 hover:bg-primary-container"
            >
              Save Expense
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpense;
