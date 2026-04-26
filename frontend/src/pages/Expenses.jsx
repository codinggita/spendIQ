import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import toast from 'react-hot-toast';
import { useExpenseFilters } from '../hooks/useExpenseFilters';
import { removeExpense, fetchExpenses } from '../features/expense/expenseSlice';
import ManualSMSInput from '../components/ManualSMSInput';
import { formatCurrency, formatDate } from '../utils/formatters';
import { CATEGORIES, PAYMENT_METHODS } from '../utils/constants';

// Define category to icon mapping for claymorphism UI
const CATEGORY_ICONS = {
  'Dining': 'restaurant',
  'Groceries': 'shopping_cart',
  'Transport': 'local_gas_station',
  'Entertainment': 'movie',
  'Utilities': 'bolt',
  'Health': 'medical_services',
  'Shopping': 'shopping_bag',
  'Other': 'payments'
};

const CATEGORY_COLORS = {
  'Dining': 'bg-primary-container/20 text-primary',
  'Groceries': 'bg-primary-container/20 text-primary',
  'Transport': 'bg-tertiary-container/20 text-tertiary',
  'Entertainment': 'bg-secondary-container/30 text-on-secondary-container',
  'Utilities': 'bg-error-container/20 text-error',
  'Health': 'bg-tertiary-container/20 text-tertiary',
  'Shopping': 'bg-secondary-container/20 text-on-secondary-container',
  'Other': 'bg-outline-variant/20 text-outline'
};

const Expenses = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { 
    searchTerm, setSearchTerm, 
    category, setCategory, 
    paymentMethod, setPaymentMethod, 
    filteredExpenses 
  } = useExpenseFilters();
  
  const { loading } = useSelector(state => state.expense);

  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  const handleDelete = (id, e) => {
    e.stopPropagation();
    dispatch(removeExpense(id));
    toast.success("Expense removed");
  };

  const totalThisMonth = filteredExpenses.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="flex flex-col h-full pb-xl">
      {/* Page Header & Controls */}
      <div className="flex flex-col xl:flex-row xl:items-end justify-between gap-lg mb-xl">
        <div>
          <h2 className="font-headline-xl text-headline-xl text-on-background mb-xs">Expenses History</h2>
          <p className="font-body-md text-body-md text-on-surface-variant">Track, categorize, and master your spending.</p>
        </div>
        
        {/* Claymorphism Search & Filter */}
        <div className="flex flex-wrap items-center gap-md w-full xl:w-auto">
          <div className="relative flex-1 min-w-[200px]">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">search</span>
            <input
              className="w-full pl-12 pr-4 py-3 rounded-full border-none outline-none font-body-md text-body-md text-on-surface clay-input focus:ring-2 focus:ring-primary/20 transition-all"
              placeholder="Search transactions..." 
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="py-3 px-4 rounded-full border-none outline-none font-body-md text-body-md text-on-surface clay-input focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer min-w-[150px]"
          >
            <option value="">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="py-3 px-4 rounded-full border-none outline-none font-body-md text-body-md text-on-surface clay-input focus:ring-2 focus:ring-primary/20 transition-all appearance-none cursor-pointer min-w-[150px]"
          >
            <option value="">All Methods</option>
            {PAYMENT_METHODS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Bento Layout: Summary & Illustration */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-lg mb-xl">
        {/* Total Expenses Summary Card */}
        <div className="lg:col-span-2 bg-surface rounded-xl clay-card p-xl flex flex-col justify-between relative overflow-hidden group">
          {/* Decorative blob background */}
          <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl group-hover:bg-primary-container/30 transition-colors duration-700"></div>
          <div className="relative z-10">
            <div className="flex items-center gap-sm mb-lg">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center clay-card-inner-base">
                <span className="material-symbols-outlined">account_balance</span>
              </div>
              <span className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Filtered Total</span>
            </div>
            <div className="flex items-baseline gap-sm mb-2">
              <h3 className="font-headline-xl text-headline-xl text-primary font-black tracking-tighter">{formatCurrency(totalThisMonth)}</h3>
              {totalThisMonth > 0 && (
                <span className="font-label-md text-label-md text-error flex items-center bg-error-container/50 px-2 py-1 rounded-full">
                  <span className="material-symbols-outlined text-[16px]">trending_up</span> Active
                </span>
              )}
            </div>
            <p className="font-body-md text-body-md text-on-surface-variant">Based on your current filter selection.</p>
          </div>
          {/* Mini internal bar chart faux representation */}
          <div className="relative z-10 mt-lg flex items-end gap-2 h-16 w-full max-w-sm">
            <div className="w-1/6 bg-tertiary-container/40 rounded-t-md h-[40%] clay-card-inner-base"></div>
            <div className="w-1/6 bg-tertiary-container/40 rounded-t-md h-[60%] clay-card-inner-base"></div>
            <div className="w-1/6 bg-tertiary-container/40 rounded-t-md h-[30%] clay-card-inner-base"></div>
            <div className="w-1/6 bg-primary-container rounded-t-md h-[80%] clay-card-inner-base"></div>
            <div className="w-1/6 bg-tertiary-container/40 rounded-t-md h-[50%] clay-card-inner-base"></div>
            <div className="w-1/6 bg-primary text-on-primary rounded-t-md h-[100%] clay-card-inner-base flex justify-center items-start pt-1">
              <span className="material-symbols-outlined text-[12px] opacity-80">star</span>
            </div>
          </div>
        </div>

        {/* Minimal SVG Illustration Card */}
        <div className="bg-surface rounded-xl clay-card p-lg flex flex-col items-center justify-center text-center min-h-[240px]">
          <div className="w-32 h-32 mb-md relative">
            <svg className="w-full h-full drop-shadow-[0_10px_15px_rgba(0,104,95,0.15)]" fill="none" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <path d="M25 15C25 12.2386 27.2386 10 30 10H70C72.7614 10 75 12.2386 75 15V85L68 80L62 85L56 80L50 85L44 80L38 85L32 80L25 85V15Z" fill="#ffffff" stroke="#00685f" strokeLinejoin="round" strokeWidth="2"></path>
              <line stroke="#a2d0c6" strokeLinecap="round" strokeWidth="3" x1="35" x2="65" y1="25" y2="25"></line>
              <line stroke="#a2d0c6" strokeLinecap="round" strokeWidth="3" x1="35" x2="55" y1="35" y2="35"></line>
              <line stroke="#a2d0c6" strokeLinecap="round" strokeWidth="3" x1="35" x2="65" y1="45" y2="45"></line>
              <line stroke="#a2d0c6" strokeLinecap="round" strokeWidth="3" x1="35" x2="45" y1="55" y2="55"></line>
              <line stroke="#00685f" strokeLinecap="round" strokeWidth="4" x1="35" x2="65" y1="68" y2="68"></line>
              <circle cx="75" cy="65" fill="#008378" r="14"></circle>
              <path d="M69 65L73 69L81 61" stroke="#ffffff" strokeLinecap="round" strokeLinejoin="round" strokeWidth="3"></path>
            </svg>
          </div>
          <h4 className="font-headline-md text-headline-md text-on-surface mb-xs">Auto-Sync Active</h4>
          <p className="font-body-sm text-body-sm text-on-surface-variant">Your receipts are being categorized automatically.</p>
        </div>
      </div>

      {/* Manual SMS Input Fallback */}
      <ManualSMSInput />

      {/* Transaction List */}
      <div>
        <div className="flex justify-between items-center mb-md">
          <h3 className="font-headline-md text-headline-md text-on-background flex items-center gap-2">
            Transactions
            {loading && <span className="material-symbols-outlined animate-spin text-primary text-[20px]">refresh</span>}
          </h3>
          <button onClick={() => navigate('/add-expense')} className="font-label-md text-label-md text-primary hover:text-primary-container transition-colors flex items-center gap-1">
            <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
            Add New
          </button>
        </div>
        
        <div className="space-y-sm">
          {filteredExpenses.length === 0 ? (
            <div className="text-center py-xl text-outline font-body-md">
              No transactions match your criteria.
            </div>
          ) : (
            filteredExpenses.map((expense) => {
              const icon = CATEGORY_ICONS[expense.category] || 'payments';
              const colorClass = CATEGORY_COLORS[expense.category] || 'bg-primary-container/20 text-primary';
              
              return (
                <div key={expense.id} className="bg-surface rounded-lg clay-card p-md flex items-center justify-between group hover:scale-[1.01] transition-transform cursor-default">
                  <div className="flex items-center gap-md">
                    <div className="w-12 h-12 rounded-full bg-white clay-card-inner-base flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>{icon}</span>
                    </div>
                    <div>
                      <h4 className="font-body-lg text-body-lg text-on-surface font-semibold">{expense.notes || expense.category}</h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span className="font-body-md text-body-md text-on-surface-variant text-[13px]">{formatDate(expense.date)}</span>
                        <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                        <span className={`font-label-sm text-label-sm px-2 py-0.5 rounded-full ${colorClass}`}>
                          {expense.category}
                        </span>
                        {expense.source === 'SMS' && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                            <span className="font-label-sm text-label-sm bg-tertiary-container/30 text-on-tertiary-container px-2 py-0.5 rounded-full flex items-center gap-1">
                              <span className="material-symbols-outlined text-[12px]">sms</span> SMS
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-4">
                    <div>
                      <p className="font-headline-md text-headline-md text-on-surface tracking-tight">-{formatCurrency(expense.amount)}</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant flex items-center justify-end gap-1">
                        <span className="material-symbols-outlined text-[14px]">credit_card</span> {expense.paymentMethod || 'Card'}
                      </p>
                    </div>
                    {/* Delete button (only visible on hover for cleaner UI, or always visible. Let's make it subtle) */}
                    <button 
                      onClick={(e) => handleDelete(expense.id, e)}
                      className="w-10 h-10 rounded-full hover:bg-error-container/50 text-outline hover:text-error flex items-center justify-center transition-colors"
                      title="Delete expense"
                    >
                      <span className="material-symbols-outlined text-[20px]">delete</span>
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Expenses;
