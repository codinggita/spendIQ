import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { fetchSubscriptions, addSubscription, removeSubscription } from '../features/subscription/subscriptionSlice';
import { formatCurrency, formatDate } from '../utils/formatters';

// ── Master Component ────────────────────────────────────────────────────────
const Subscriptions = () => {
  const dispatch = useDispatch();
  const { items: subscriptions, loading } = useSelector((state) => state.subscription);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchSubscriptions());
  }, [dispatch]);

  const formik = useFormik({
    initialValues: { name: '', amount: '', renewalDate: '', category: 'Streaming' },
    validationSchema: Yup.object({
      name: Yup.string().required('Name is required'),
      amount: Yup.number().positive('Must be positive').required('Amount is required'),
      renewalDate: Yup.date().required('Renewal date is required'),
      category: Yup.string().required('Category is required'),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        dispatch(addSubscription({ ...values, id: Date.now().toString() }));
        toast.success('Subscription added!');
        resetForm();
        setIsModalOpen(false);
      } catch (err) {
        toast.error('Failed to add subscription');
      }
    },
  });

  const handleDelete = (id) => {
    dispatch(removeSubscription(id));
    toast.success('Subscription removed');
  };

  const totalMonthly = subscriptions.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex-grow pb-10">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="text-4xl font-black text-on-background tracking-tight">Recurring Payments</h2>
          <p className="text-outline mt-1">Manage your active subscriptions and upcoming bills.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-surface-container-low px-5 py-3 rounded-2xl shadow-clay-inner border border-white/40">
            <span className="text-xs font-black text-outline uppercase tracking-widest block">Monthly Burn</span>
            <span className="text-xl font-black text-primary">{formatCurrency(totalMonthly)}</span>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-14 px-8 rounded-full bg-primary text-white font-bold shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
          >
            <span className="material-symbols-outlined">add</span>
            Add New
          </button>
        </div>
      </header>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {subscriptions.length === 0 && !loading && (
          <div className="col-span-full py-20 flex flex-col items-center opacity-30">
            <span className="material-symbols-outlined text-[80px] mb-4">notifications_off</span>
            <p className="text-xl font-bold">No subscriptions found</p>
          </div>
        )}

        {subscriptions.map((sub) => (
          <div 
            key={sub.id} 
            className="group bg-surface rounded-[32px] p-6 shadow-clay border border-white/50 relative overflow-hidden transition-all hover:translate-y-[-4px] hover:shadow-2xl"
          >
            {/* Background Icon Blob */}
            <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary-container/10 rounded-full flex items-center justify-center blur-2xl group-hover:bg-primary-container/20 transition-colors" />
            
            <div className="relative z-10">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 rounded-2xl bg-surface-container flex items-center justify-center shadow-clay text-primary">
                  <span className="material-symbols-outlined text-3xl">{sub.category === 'Streaming' ? 'movie' : 'bolt'}</span>
                </div>
                <button 
                  onClick={() => handleDelete(sub.id)}
                  className="w-10 h-10 rounded-full flex items-center justify-center text-outline hover:text-error hover:bg-error/5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[20px]">delete</span>
                </button>
              </div>

              <h3 className="text-xl font-black text-on-surface mb-1">{sub.name}</h3>
              <p className="text-sm font-bold text-outline uppercase tracking-wider mb-6">{sub.category}</p>

              <div className="flex justify-between items-end border-t border-surface-variant/20 pt-4">
                <div>
                  <p className="text-xs font-black text-outline uppercase tracking-widest mb-1">Renewal</p>
                  <p className="font-bold text-on-surface">{formatDate(sub.renewalDate)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-black text-outline uppercase tracking-widest mb-1">Amount</p>
                  <p className="text-2xl font-black text-primary">{formatCurrency(sub.amount)}<span className="text-sm font-medium text-outline">/mo</span></p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Portal */}
      <SubscriptionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        formik={formik} 
      />
    </div>
  );
};

// ── Modal Component ─────────────────────────────────────────────────────────
const SubscriptionModal = ({ isOpen, onClose, formik }) => {
  if (!isOpen) return null;

  // Use the modal-root div we added to index.html
  const modalRoot = document.getElementById('modal-root') || document.body;

  return ReactDOM.createPortal(
    <div className="fixed inset-0 flex items-center justify-center z-[9999] px-4">
      {/* Dim Overlay */}
      <div 
        className="absolute inset-0 bg-on-surface/60 backdrop-blur-[2px]" 
        onClick={onClose}
      />
      
      {/* Modal Card */}
      <div className="relative w-full max-w-[500px] bg-surface rounded-[40px] shadow-2xl overflow-hidden border border-white/40 animate-in fade-in zoom-in duration-300">
        <div className="p-8 md:p-10">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-black text-on-surface">Add Subscription</h3>
            <button onClick={onClose} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-outline hover:text-on-surface transition-colors">
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-outline uppercase tracking-widest ml-2">Service Name</label>
              <input
                name="name"
                {...formik.getFieldProps('name')}
                placeholder="Netflix, Spotify, etc."
                className="w-full h-14 px-6 rounded-2xl bg-surface-container-low shadow-clay-inner border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold"
              />
              {formik.touched.name && formik.errors.name && <p className="text-xs text-error ml-2">{formik.errors.name}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-outline uppercase tracking-widest ml-2">Monthly Fee</label>
                <input
                  type="number"
                  name="amount"
                  {...formik.getFieldProps('amount')}
                  placeholder="0.00"
                  className="w-full h-14 px-6 rounded-2xl bg-surface-container-low shadow-clay-inner border-none outline-none focus:ring-2 focus:ring-primary/20 font-black text-primary"
                />
                {formik.touched.amount && formik.errors.amount && <p className="text-xs text-error ml-2">{formik.errors.amount}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-outline uppercase tracking-widest ml-2">Category</label>
                <select
                  name="category"
                  {...formik.getFieldProps('category')}
                  className="w-full h-14 px-6 rounded-2xl bg-surface-container-low shadow-clay-inner border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold appearance-none cursor-pointer"
                >
                  <option value="Streaming">Streaming</option>
                  <option value="Health">Health</option>
                  <option value="Utility">Utility</option>
                  <option value="Productivity">Productivity</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-outline uppercase tracking-widest ml-2">Next Renewal</label>
              <input
                type="date"
                name="renewalDate"
                {...formik.getFieldProps('renewalDate')}
                className="w-full h-14 px-6 rounded-2xl bg-surface-container-low shadow-clay-inner border-none outline-none focus:ring-2 focus:ring-primary/20 font-bold cursor-pointer"
              />
              {formik.touched.renewalDate && formik.errors.renewalDate && <p className="text-xs text-error ml-2">{formik.errors.renewalDate}</p>}
            </div>

            <button
              type="submit"
              className="w-full h-16 mt-4 rounded-3xl bg-primary text-white font-black text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>task_alt</span>
              Create Subscription
            </button>
          </form>
        </div>
      </div>
    </div>,
    modalRoot
  );
};

export default Subscriptions;
