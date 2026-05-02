import React, { useState, useMemo } from 'react';
import SEO from '../components/SEO';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import Modal from '../components/common/Modal';
import { updateBudget, addBudget } from '../features/budget/budgetSlice';
import { formatCurrency } from '../utils/formatters';
import { CATEGORIES } from '../utils/constants';

const Budget = () => {
  const dispatch = useDispatch();
  const { budgets } = useSelector((state) => state.budget);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState(null);

  const totalBudget = budgets.reduce((acc, curr) => acc + curr.limit, 0) || 1; // avoid division by zero
  const totalSpent = budgets.reduce((acc, curr) => acc + curr.spent, 0);
  const remainingBudget = Math.max(totalBudget - totalSpent, 0);
  const totalPercentUsed = Math.min((totalSpent / totalBudget) * 100, 100);

  const worstBudget = useMemo(() => {
    let worst = null;
    let maxPercent = 0;
    budgets.forEach(b => {
      const p = b.spent / b.limit;
      if (p > maxPercent) {
        maxPercent = p;
        worst = { ...b, percent: p * 100 };
      }
    });
    return (worst && worst.percent > 80) ? worst : null;
  }, [budgets]);

  const handleOpenModal = (budget = null) => {
    setEditingBudget(budget);
    formik.setValues({
      category: budget ? budget.category : '',
      limit: budget ? budget.limit : '',
    });
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditingBudget(null);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      category: '',
      limit: '',
    },
    validationSchema: Yup.object({
      category: Yup.string().required('Category is required').oneOf(CATEGORIES),
      limit: Yup.number().positive('Must be a positive number').required('Limit is required'),
    }),
    onSubmit: (values) => {
      if (editingBudget) {
        dispatch(updateBudget({ id: editingBudget.id, ...values }));
        toast.success('Budget updated');
      } else {
        if (budgets.some(b => b.category === values.category)) {
          toast.error('A budget for this category already exists.');
          return;
        }
        dispatch(addBudget(values));
        toast.success('Budget added');
      }
      handleCloseModal();
    },
  });

  const getCategoryIcon = (category) => {
    const icons = {
      'Food & Dining': 'restaurant',
      'Shopping': 'shopping_cart',
      'Transportation': 'directions_car',
      'Entertainment': 'movie',
      'Bills & Utilities': 'receipt_long',
      'Health & Fitness': 'fitness_center',
      'Travel': 'flight_takeoff',
      'Other': 'category'
    };
    return icons[category] || 'category';
  };

  return (
    <div className="flex-grow pb-xl">
      <SEO 
        title="Budget" 
        description="Set and manage your monthly budgets. Stay on track with SpendIQ's smart budget planning and alerts." 
      />
      <header className="mb-lg flex justify-between items-end">
          <div>
              <h1 className="font-headline-xl text-headline-xl text-on-surface mb-xs">Budgets &amp; Goals</h1>
              <p className="font-body-lg text-body-lg text-on-surface-variant">Shape your financial future, one soft step at a time.</p>
          </div>
          <button
              onClick={() => handleOpenModal()}
              className="bg-primary text-on-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 clay-btn-primary hover:scale-105 active:scale-95 transition-all duration-200">
              <span className="material-symbols-outlined text-sm">add</span>
              New Budget
          </button>
      </header>

      {/* Attention Alert */}
      {worstBudget && (
        <div className="bg-error-container rounded-DEFAULT p-md mb-lg flex items-start gap-4 shadow-[inset_2px_2px_6px_rgba(255,255,255,0.7),inset_-2px_-2px_6px_rgba(186,26,26,0.1),4px_4px_12px_rgba(186,26,26,0.1)] border border-white/40">
            <div className="bg-error text-on-error w-10 h-10 rounded-full flex items-center justify-center clay-btn-primary shrink-0 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),inset_-2px_-2px_4px_rgba(0,0,0,0.2)]">
                <span className="material-symbols-outlined">warning</span>
            </div>
            <div>
                <h3 className="font-headline-md text-body-lg text-on-error-container mb-1 font-semibold">Attention Needed</h3>
                <p className="font-body-md text-body-md text-on-error-container/80">
                  Your "{worstBudget.category}" budget is currently at {worstBudget.percent.toFixed(0)}% of its monthly limit. Consider adjusting your spending to stay on track.
                </p>
            </div>
        </div>
      )}

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-lg mb-lg">
          {/* Main Overview (Span 8) */}
          <div className="clay-card rounded-xl p-lg col-span-1 md:col-span-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute -right-10 -top-10 opacity-10">
                  <svg fill="none" height="200" stroke="#00685f" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" width="200">
                      <circle cx="12" cy="12" r="10"></circle>
                      <circle cx="12" cy="12" r="6"></circle>
                      <circle cx="12" cy="12" r="2"></circle>
                  </svg>
              </div>
              <div className="flex justify-between items-start mb-xl relative z-10">
                  <div>
                      <span className="font-label-sm text-label-sm text-primary uppercase tracking-wider bg-primary/10 px-3 py-1 rounded-full shadow-[inset_1px_1px_2px_rgba(255,255,255,0.5),inset_-1px_-1px_2px_rgba(0,0,0,0.05)]">
                          Overview
                      </span>
                      <h2 className="font-headline-lg text-headline-lg text-on-surface mt-sm">Total Monthly Budget</h2>
                      <p className="font-body-md text-body-md text-on-surface-variant">Target: {formatCurrency(totalBudget)} / Month</p>
                  </div>
              </div>
              <div className="relative z-10">
                  <div className="flex justify-between text-label-md font-label-md mb-2">
                      <span className="text-on-surface">{formatCurrency(totalSpent)} spent</span>
                      <span className="text-primary">{totalPercentUsed.toFixed(0)}%</span>
                  </div>
                  {/* Tactile Progress Track */}
                  <div className="h-6 w-full bg-surface-container-high rounded-full clay-input-recessed p-1 relative overflow-hidden">
                      {/* Tactile Progress Fill */}
                      <div 
                        className="h-full bg-primary rounded-full clay-btn-primary relative"
                        style={{ width: `${totalPercentUsed}%` }}
                      >
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent to-white/20 rounded-full"></div>
                      </div>
                  </div>
              </div>
          </div>

          {/* Secondary Stats (Span 4) */}
          <div className="clay-card rounded-xl p-lg col-span-1 md:col-span-4 flex flex-col justify-between items-center text-center">
              <div className="w-16 h-16 rounded-full bg-tertiary-container text-on-tertiary-container flex items-center justify-center shadow-[inset_2px_2px_5px_rgba(255,255,255,0.4),inset_-2px_-2px_5px_rgba(0,0,0,0.2)] mb-md">
                  <span className="material-symbols-outlined text-3xl">account_balance_wallet</span>
              </div>
              <div>
                  <h3 className="font-headline-md text-headline-md text-on-surface">Remaining Balance</h3>
                  <p className="font-body-md text-body-md text-on-surface-variant mt-1">{formatCurrency(remainingBudget)}</p>
              </div>
              {/* Circular Progress */}
              <div className="relative w-24 h-24 mt-4">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      <circle className="clay-input-recessed" cx="50" cy="50" fill="transparent" r="40" stroke="#e0e3e5" strokeWidth="12" style={{ filter: 'drop-shadow(inset 2px 2px 4px rgba(0,0,0,0.1))' }}></circle>
                      <circle cx="50" cy="50" fill="transparent" r="40" stroke="#38645c" strokeDasharray="251.2" strokeDashoffset={251.2 - (251.2 * (100 - totalPercentUsed) / 100)} strokeLinecap="round" strokeWidth="12" style={{ filter: 'drop-shadow(2px 2px 3px rgba(0,0,0,0.2))' }}></circle>
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center font-label-md text-label-md text-tertiary">
                      {(100 - totalPercentUsed).toFixed(0)}%
                  </div>
              </div>
          </div>
      </div>

      {/* Budgets Section */}
      <div className="clay-card rounded-xl p-lg">
          <div className="flex justify-between items-center mb-md">
              <h2 className="font-headline-lg text-headline-lg text-on-surface">Category Budgets</h2>
          </div>
          
          <div className="space-y-6">
              {budgets.length === 0 ? (
                <div className="text-center py-8 text-on-surface-variant font-body-md">
                  No budgets configured yet. Click "New Budget" to start planning!
                </div>
              ) : budgets.map((budget) => {
                  const percentUsed = Math.min((budget.spent / budget.limit) * 100, 100);
                  const isWarning = percentUsed > 80;
                  
                  return (
                      <div key={budget.id} className="relative group cursor-pointer transition-transform" onClick={() => handleOpenModal(budget)}>
                          <div className="flex justify-between items-end mb-2">
                              <div className="flex items-center gap-3">
                                  <div className={`w-10 h-10 rounded-full flex items-center justify-center clay-input-recessed ${isWarning ? 'bg-error-container text-on-error-container' : 'bg-secondary-container text-on-secondary-container'}`}>
                                      <span className="material-symbols-outlined text-sm">{getCategoryIcon(budget.category)}</span>
                                  </div>
                                  <div>
                                      <h4 className="font-label-md text-body-md font-semibold text-on-surface">{budget.category}</h4>
                                      {isWarning && <p className="font-label-sm text-label-sm text-error">Approaching limit</p>}
                                  </div>
                              </div>
                              <div className="text-right">
                                  <span className={`font-label-md text-body-md font-semibold ${isWarning ? 'text-error' : 'text-on-surface'}`}>{formatCurrency(budget.spent)}</span>
                                  <span className="font-label-sm text-label-sm text-on-surface-variant"> / {formatCurrency(budget.limit)}</span>
                              </div>
                          </div>
                          <div className="h-4 w-full bg-surface-container-high rounded-full clay-input-recessed p-1">
                              <div className={`h-full rounded-full clay-btn-primary ${isWarning ? 'bg-error' : 'bg-secondary'}`} style={{ width: `${percentUsed}%` }}></div>
                          </div>
                          
                          {/* Hover Edit Hint */}
                          <div className="absolute right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity flex items-center bg-surface-container-low rounded p-1 shadow-sm">
                            <span className="material-symbols-outlined text-sm text-primary">edit</span>
                          </div>
                      </div>
                  )
              })}
          </div>
      </div>

      {/* Add/Edit Modal (Claymorphism style overlay inside standard modal) */}
      <Modal isOpen={modalOpen} onClose={handleCloseModal} title={editingBudget ? "Edit Budget" : "Add Budget"}>
        <form onSubmit={formik.handleSubmit} className="space-y-5 py-2 mt-4">
          <div>
            <label className="block font-label-sm text-label-sm text-outline mb-2">Category</label>
            <div className="relative">
              <select
                {...formik.getFieldProps('category')}
                disabled={!!editingBudget}
                className="clay-input w-full rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border-none outline-none focus:ring-2 focus:ring-primary appearance-none bg-surface-container disabled:opacity-50"
              >
                <option value="" disabled>Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <span className="material-symbols-outlined absolute right-4 top-3 text-outline pointer-events-none">expand_more</span>
            </div>
            {formik.touched.category && formik.errors.category && (
              <p className="mt-1 text-sm text-error">{formik.errors.category}</p>
            )}
          </div>

          <div>
            <label className="block font-label-sm text-label-sm text-outline mb-2">Monthly Limit (₹)</label>
            <input
              type="number"
              {...formik.getFieldProps('limit')}
              className="clay-input w-full rounded-xl px-4 py-3 font-body-md text-body-md text-on-surface border-none outline-none focus:ring-2 focus:ring-primary"
              placeholder="0"
            />
            {formik.touched.limit && formik.errors.limit && (
              <p className="mt-1 text-sm text-error">{formik.errors.limit}</p>
            )}
          </div>

          <div className="pt-6 flex justify-end gap-4">
            <button
              type="button"
              onClick={handleCloseModal}
              className="px-6 py-3 rounded-full font-label-md text-label-md text-on-surface-variant hover:text-on-surface transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-on-primary font-label-md text-label-md px-8 py-3 rounded-full clay-btn-primary hover:scale-105 active:scale-95 transition-all duration-200"
            >
              {editingBudget ? 'Save Changes' : 'Create Budget'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Budget;
