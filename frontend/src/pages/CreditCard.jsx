import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate, daysUntil } from '../utils/formatters';
import { addCard } from '../features/card/cardSlice';

const CreditCard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items: cards } = useSelector((state) => state.card);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // For this demo, we'll just focus on the first card for the detailed stats, 
  // but the user can add more.
  const activeCard = cards[0] || {
    cardNumber: '0000',
    cardholderName: 'User',
    expiryDate: '01/99',
    network: 'VISA',
    creditLimit: 0,
    outstanding: 0,
    availableCredit: 0,
    dueDate: new Date().toISOString(),
    transactions: []
  };

  const percentUsed = activeCard.creditLimit > 0 ? (activeCard.outstanding / activeCard.creditLimit) * 100 : 0;
  const daysLeft = daysUntil(activeCard.dueDate);

  const formik = useFormik({
    initialValues: {
      cardholderName: '',
      cardNumber: '',
      expiryDate: '',
      network: 'VISA',
      creditLimit: '',
    },
    validationSchema: Yup.object({
      cardholderName: Yup.string().required('Required'),
      cardNumber: Yup.string().matches(/^\d{4}$/, 'Enter last 4 digits').required('Required'),
      expiryDate: Yup.string().matches(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Use MM/YY format').required('Required'),
      creditLimit: Yup.number().positive().required('Required'),
    }),
    onSubmit: (values, { resetForm }) => {
      const newCard = {
        ...values,
        id: Date.now().toString(),
        outstanding: 0,
        availableCredit: values.creditLimit,
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        transactions: []
      };
      dispatch(addCard(newCard));
      toast.success('Card added successfully!');
      resetForm();
      setIsModalOpen(false);
    }
  });

  return (
    <div className="flex-grow pb-10">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-on-background tracking-tight">Your Cards</h1>
          <p className="text-outline mt-1">Manage limits, view rewards, and track utilization.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-white font-bold px-8 py-4 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined">add</span>
          Add New Card
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Card Visual & Mini Cards */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Main Card Visual */}
          <div className="bg-surface-container rounded-[40px] p-8 shadow-clay flex flex-col items-center justify-center relative overflow-hidden min-h-[340px]">
            <div className="absolute -right-20 -top-20 w-64 h-64 bg-primary/10 rounded-full blur-[80px]" />
            
            <div className="relative w-full max-w-[340px] aspect-[1.586/1] bg-gradient-to-br from-[#1a1a1a] to-[#333333] rounded-3xl shadow-2xl p-8 flex flex-col justify-between overflow-hidden group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 mix-blend-overlay" />
              
              <div className="flex justify-between items-start relative z-10">
                <span className="material-symbols-outlined text-white/40 text-[40px]">contactless</span>
                <div className="text-xl font-black text-white italic opacity-80">{activeCard.network}</div>
              </div>
              
              <div className="relative z-10">
                <div className="text-2xl text-white font-mono tracking-[0.2em] mb-6 shadow-sm">
                  •••• •••• •••• {activeCard.cardNumber}
                </div>
                <div className="flex justify-between items-end">
                  <div>
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Cardholder</div>
                    <div className="text-sm font-bold text-white uppercase tracking-wider">{activeCard.cardholderName}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] text-white/40 uppercase tracking-widest mb-1">Expires</div>
                    <div className="text-sm font-bold text-white">{activeCard.expiryDate}</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-xs">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Active Premium Card
            </div>
          </div>

          {/* Other Cards List */}
          <div className="flex flex-col gap-3">
            <h3 className="text-xs font-black text-outline uppercase tracking-widest ml-4">My Portfolio ({cards.length})</h3>
            {cards.map(c => (
              <div key={c.id} className={`p-4 rounded-2xl flex items-center justify-between border-2 transition-all cursor-pointer ${c.id === activeCard.id ? 'bg-white border-primary shadow-clay' : 'bg-surface border-transparent opacity-60 hover:opacity-100'}`}>
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-outline">credit_card</span>
                  </div>
                  <div>
                    <div className="font-bold text-on-surface">{c.network} •••• {c.cardNumber}</div>
                    <div className="text-xs text-outline">{c.cardholderName}</div>
                  </div>
                </div>
                <div className="font-black text-primary text-sm">{formatCurrency(c.outstanding)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Detailed Stats */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="bg-surface rounded-[40px] p-8 shadow-clay border border-white/50">
            <div className="flex justify-between items-end mb-8">
              <div>
                <h3 className="text-2xl font-black text-on-surface">Credit Utilization</h3>
                <p className="text-outline">You've used {percentUsed.toFixed(0)}% of your limit.</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-black text-primary">{formatCurrency(activeCard.outstanding)}</div>
                <div className="text-xs font-bold text-outline">Limit: {formatCurrency(activeCard.creditLimit)}</div>
              </div>
            </div>

            <div className="h-4 w-full bg-surface-container-high rounded-full p-1 overflow-hidden shadow-inner">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${percentUsed > 80 ? 'bg-error' : 'bg-primary'}`}
                style={{ width: `${Math.min(percentUsed, 100)}%` }}
              />
            </div>
            
            <div className="flex justify-between items-center mt-6 p-4 rounded-2xl bg-surface-container-low">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">event_upcoming</span>
                <span className="text-sm font-bold text-outline">Next Payment Due</span>
              </div>
              <div className="text-right">
                <div className="font-black text-on-surface">{formatDate(activeCard.dueDate)}</div>
                <div className={`text-[10px] font-black uppercase ${daysLeft < 5 ? 'text-error' : 'text-primary'}`}>
                  {daysLeft >= 0 ? `In ${daysLeft} days` : 'Overdue'}
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-surface rounded-[40px] p-8 shadow-clay flex flex-col justify-between h-40">
              <div className="flex items-center gap-2 opacity-50">
                <span className="material-symbols-outlined">stars</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Rewards</span>
              </div>
              <div>
                <div className="text-3xl font-black text-on-surface">42,850</div>
                <div className="text-xs text-primary font-bold">+1,240 this month</div>
              </div>
            </div>
            <div className="bg-surface rounded-[40px] p-8 shadow-clay flex flex-col justify-between h-40">
              <div className="flex items-center gap-2 opacity-50">
                <span className="material-symbols-outlined">percent</span>
                <span className="text-[10px] font-black uppercase tracking-widest">Current APR</span>
              </div>
              <div>
                <div className="text-3xl font-black text-on-surface">18.99%</div>
                <div className="text-xs text-outline font-bold">Variable rate</div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-surface rounded-[40px] p-8 shadow-clay border border-white/50 flex-1">
            <h3 className="text-xl font-black text-on-surface mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {activeCard.transactions?.length === 0 ? (
                <div className="text-center py-10 opacity-30">No recent activity</div>
              ) : activeCard.transactions?.map((txn) => (
                <div key={txn.id} className="flex items-center justify-between p-4 rounded-2xl hover:bg-surface-container-low transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shadow-sm">
                      <span className="material-symbols-outlined text-outline text-lg">shopping_bag</span>
                    </div>
                    <div>
                      <div className="font-bold text-on-surface">{txn.description}</div>
                      <div className="text-xs text-outline">{formatDate(txn.date)}</div>
                    </div>
                  </div>
                  <div className="font-black text-on-surface">-{formatCurrency(txn.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {isModalOpen && ReactDOM.createPortal(
        <div className="fixed inset-0 flex items-center justify-center z-[9999] px-4">
          <div className="absolute inset-0 bg-on-surface/60 backdrop-blur-[2px]" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-[460px] bg-surface rounded-[40px] shadow-2xl overflow-hidden border border-white/40 animate-in fade-in zoom-in duration-300 p-8 md:p-10">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black text-on-surface">Link New Card</h3>
              <button onClick={() => setIsModalOpen(false)} className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-outline">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <form onSubmit={formik.handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-outline uppercase tracking-widest ml-2">Cardholder Name</label>
                <input
                  name="cardholderName"
                  {...formik.getFieldProps('cardholderName')}
                  className="w-full h-14 px-6 rounded-2xl bg-surface-container-low shadow-clay-inner outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                  placeholder="e.g. JOHN DOE"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-black text-outline uppercase tracking-widest ml-2">Last 4 Digits</label>
                  <input
                    name="cardNumber"
                    {...formik.getFieldProps('cardNumber')}
                    className="w-full h-14 px-6 rounded-2xl bg-surface-container-low shadow-clay-inner outline-none focus:ring-2 focus:ring-primary/20 font-black tracking-widest"
                    placeholder="1234"
                    maxLength="4"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-outline uppercase tracking-widest ml-2">Expiry</label>
                  <input
                    name="expiryDate"
                    {...formik.getFieldProps('expiryDate')}
                    className="w-full h-14 px-6 rounded-2xl bg-surface-container-low shadow-clay-inner outline-none focus:ring-2 focus:ring-primary/20 font-bold"
                    placeholder="MM/YY"
                    maxLength="5"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-outline uppercase tracking-widest ml-2">Credit Limit</label>
                <input
                  type="number"
                  name="creditLimit"
                  {...formik.getFieldProps('creditLimit')}
                  className="w-full h-14 px-6 rounded-2xl bg-surface-container-low shadow-clay-inner outline-none focus:ring-2 focus:ring-primary/20 font-black text-primary text-xl"
                  placeholder="50000"
                />
              </div>

              <button
                type="submit"
                className="w-full h-16 rounded-3xl bg-primary text-white font-black text-lg shadow-lg hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2"
              >
                <span className="material-symbols-outlined">link</span>
                Add Card to Portfolio
              </button>
            </form>
          </div>
        </div>,
        document.getElementById('modal-root') || document.body
      )}
    </div>
  );
};

export default CreditCard;
