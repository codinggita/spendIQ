import React from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { formatCurrency } from '../utils/formatters';
import SEO from '../components/SEO';

const COLORS = ['#00685f', '#6bd8cb', '#8b5cf6', '#f59e0b', '#ec4899', '#ef4444'];

const Dashboard = () => {
  const navigate = useNavigate();
  const { items: expenseItems } = useSelector((state) => state.expense);
  const expenses = Array.isArray(expenseItems) ? expenseItems : [];
  // Financial Stats
  const totalBalance = 125000; // Still mock, usually from a bank sync or settings
  const totalMonthlySpending = expenses.reduce((acc, curr) => acc + (curr.amount || 0), 0);
  const savings = Math.max(totalBalance - totalMonthlySpending, 0);

  // ── Weekly Cash Flow (Last 7 Days) ──────────────────────────────────────────
  const getWeeklyData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const data = [];
    const now = new Date();
    
    // Initialize last 7 days
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(now.getDate() - i);
      data.push({
        name: days[d.getDay()],
        dateStr: d.toISOString().split('T')[0],
        amount: 0
      });
    }

    // Populate with real expense data
    expenses.forEach(exp => {
      const expDate = exp.date?.split('T')[0];
      const dayObj = data.find(d => d.dateStr === expDate);
      if (dayObj) {
        dayObj.amount += exp.amount || 0;
      }
    });

    return data;
  };

  const weeklyData = getWeeklyData();
  const maxWeekly = Math.max(...weeklyData.map(d => d.amount), 1);

  // ── Spending Categories (Donut) ──────────────────────────────────────────────
  const categoryData = expenses.reduce((acc, curr) => {
    const existing = acc.find(item => item.name === curr.category);
    if (existing) {
      existing.value += curr.amount;
    } else {
      acc.push({ name: curr.category, value: curr.amount });
    }
    return acc;
  }, []);

  categoryData.sort((a, b) => b.value - a.value);

  // Generate conic gradient for the donut chart
  let currentPercentage = 0;
  const gradientStops = categoryData.length > 0 ? categoryData.map((cat, index) => {
    const percentage = totalMonthlySpending > 0 ? (cat.value / totalMonthlySpending) * 100 : 0;
    const start = currentPercentage;
    const end = currentPercentage + percentage;
    currentPercentage = end;
    return `${COLORS[index % COLORS.length]} ${start}% ${end}%`;
  }).join(', ') : '#eceef0 0% 100%';

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full pb-xl">
      <SEO 
        title="Dashboard" 
        description="View your financial ecosystem at a glance. Track spending, savings, and get AI-powered insights on SpendIQ." 
      />
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-xl">
        <div>
          <h1 className="font-headline-xl text-headline-xl text-on-background mb-xs">Welcome Back</h1>
          <p className="font-body-lg text-body-lg text-outline">Your financial ecosystem at a glance.</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/receipt-scanner')}
            className="bg-surface-container text-primary font-label-md text-label-md px-6 py-3 rounded-full flex items-center gap-2 border border-primary/10 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.6),inset_-2px_-2px_4px_rgba(0,0,0,0.05),4px_4px_8px_rgba(0,0,0,0.05)] hover:scale-[1.02] transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">document_scanner</span>
            Scan Receipt
          </button>
          <button
            onClick={() => navigate('/add-expense')}
            className="clay-btn-primary px-6 py-3 font-label-md text-label-md flex items-center gap-2 hover:scale-[1.05] active:scale-[0.95] transition-all"
          >
            <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>add_circle</span>
            Add Transaction
          </button>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-lg auto-rows-auto lg:auto-rows-[160px]">
        
        {/* Total Balance (Hero) */}
        <div className="clay-card lg:col-span-2 row-span-1 p-lg flex flex-col justify-between relative overflow-hidden group">
          <div className="absolute -right-16 -top-16 w-48 h-48 bg-primary-container/20 rounded-full blur-3xl group-hover:bg-primary-container/30 transition-colors duration-700" />
          <div className="relative z-10">
            <div className="flex items-center gap-2 text-outline mb-2">
              <div className="w-8 h-8 rounded-full bg-primary-container/20 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>account_balance</span>
              </div>
              <h3 className="font-label-md text-label-md uppercase tracking-wider">Total Balance</h3>
            </div>
            <div className="font-headline-xl text-[48px] text-on-background font-black tracking-tighter">{formatCurrency(totalBalance)}</div>
            <div className="flex items-center gap-1 mt-2 text-primary font-label-sm text-label-sm">
              <span className="material-symbols-outlined text-[16px]">trending_up</span>
              <span>+2.4% from last month</span>
            </div>
          </div>
          <svg className="absolute bottom-0 right-0 w-48 h-24 opacity-5 text-primary pointer-events-none" fill="currentColor" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0,100 C30,80 50,20 100,0 L100,100 Z" />
          </svg>
        </div>

        {/* Monthly Spending */}
        <div className="clay-card p-lg flex flex-col justify-center relative overflow-hidden">
          <div className="flex items-center gap-2 text-outline mb-3">
            <div className="w-8 h-8 rounded-full bg-error-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-error text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>shopping_cart</span>
            </div>
            <h3 className="font-label-md text-label-md uppercase tracking-wider">Monthly Spend</h3>
          </div>
          <div className="font-headline-md text-headline-md text-on-surface font-bold">{formatCurrency(totalMonthlySpending)}</div>
          <div className="w-full bg-surface-container h-2 rounded-full mt-4 overflow-hidden shadow-inner">
            <div 
              className="bg-error h-full rounded-full transition-all duration-1000" 
              style={{ width: `${Math.min((totalMonthlySpending / 50000) * 100, 100)}%` }} 
            />
          </div>
        </div>

        {/* Savings */}
        <div className="clay-card p-lg flex flex-col justify-center relative overflow-hidden">
          <div className="flex items-center gap-2 text-outline mb-3">
            <div className="w-8 h-8 rounded-full bg-tertiary-container/20 flex items-center justify-center">
              <span className="material-symbols-outlined text-tertiary text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>savings</span>
            </div>
            <h3 className="font-label-md text-label-md uppercase tracking-wider">Net Savings</h3>
          </div>
          <div className="font-headline-md text-headline-md text-on-surface font-bold">{formatCurrency(savings)}</div>
          <div className="flex -space-x-2 mt-4">
            {[1,2,3].map(i => (
              <div key={i} className="w-8 h-8 rounded-full bg-surface-container-high border-2 border-surface shadow-sm flex items-center justify-center overflow-hidden">
                <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="user" className="w-full h-full object-cover" />
              </div>
            ))}
            <div className="w-8 h-8 rounded-full bg-primary-container border-2 border-surface shadow-sm flex items-center justify-center font-label-sm text-[10px] text-primary">+2</div>
          </div>
        </div>

        {/* Cash Flow Graph (Dynamic) */}
        <div className="clay-card lg:col-span-2 row-span-2 p-lg flex flex-col min-h-[320px]">
          <div className="flex justify-between items-center mb-10">
            <h3 className="font-headline-md text-headline-md text-on-surface">Cash Flow</h3>
            <span className="font-label-sm text-label-sm text-outline px-3 py-1 rounded-full bg-surface-container">Last 7 Days</span>
          </div>
          
          <div className="flex items-end justify-between gap-3 flex-1 px-2">
            {weeklyData.map((day) => {
              const heightPct = Math.max((day.amount / maxWeekly) * 100, 4);
              const isHigh = heightPct > 40;
              return (
                <div key={day.dateStr} className="flex-1 flex flex-col items-center gap-3 h-full justify-end group">
                  <div className="relative w-full flex flex-col items-center justify-end h-full">
                    {/* Tooltip on hover */}
                    <div className="absolute -top-8 bg-on-surface text-surface px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                      {formatCurrency(day.amount)}
                    </div>
                    
                    <div
                      className={`w-full rounded-t-2xl transition-all duration-700 ease-out cursor-pointer hover:brightness-110 ${
                        isHigh
                          ? 'bg-primary shadow-[inset_2px_2px_4px_rgba(255,255,255,0.3),4px_4px_12px_rgba(0,104,95,0.2)]'
                          : 'bg-surface-container-highest shadow-[inset_2px_2px_4px_rgba(255,255,255,0.6),inset_-2px_-2px_4px_rgba(0,0,0,0.05)]'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="font-label-sm text-label-sm text-outline group-hover:text-primary transition-colors">{day.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* AI Insight */}
        <div className="clay-card lg:col-span-1 row-span-2 p-lg bg-gradient-to-br from-surface to-surface-container-low flex flex-col relative overflow-hidden group min-h-[320px]">
          <div className="absolute -right-8 -bottom-8 w-32 h-32 bg-primary-container/30 rounded-full blur-3xl opacity-50 group-hover:scale-125 transition-transform duration-1000" />
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
            <div className="w-11 h-11 rounded-2xl bg-primary shadow-lg flex items-center justify-center text-on-primary">
              <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>smart_toy</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">AI Insights</h3>
          </div>

          <div className="flex-1 relative z-10">
            <div className="p-4 rounded-2xl bg-surface-container-lowest border border-primary/5 shadow-[inset_2px_2px_4px_rgba(255,255,255,0.6),4px_4px_12px_rgba(0,0,0,0.03)]">
              <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                You've spent <span className="text-primary font-bold">{formatCurrency(totalMonthlySpending)}</span> this month. 
                That's <span className="text-error font-bold">12% higher</span> than average. 
                Try reducing <span className="italic">Dining</span> expenses to save more.
              </p>
            </div>
          </div>

          <button className="w-full mt-6 h-12 rounded-full border-2 border-primary/10 text-primary font-label-md text-label-md hover:bg-primary/5 transition-colors relative z-10">
            View Analysis
          </button>
        </div>

        {/* Categories (Dynamic Donut) */}
        <div className="clay-card lg:col-span-1 row-span-2 p-lg flex flex-col items-center min-h-[320px]">
          <h3 className="font-headline-md text-headline-md text-on-surface w-full text-left mb-6">Top Categories</h3>
          
          <div
            className="relative w-40 h-40 rounded-full shadow-[8px_8px_16px_rgba(0,0,0,0.06),-8px_-8px_16px_rgba(255,255,255,0.9)] mb-8 flex items-center justify-center"
            style={{ background: `conic-gradient(${gradientStops})` }}
          >
            <div className="w-24 h-24 bg-surface rounded-full shadow-[inset_4px_4px_8px_rgba(0,0,0,0.08),inset_-4px_-4px_8px_rgba(255,255,255,0.9)] flex flex-col items-center justify-center">
              {categoryData.length > 0 ? (
                <>
                  <span className="font-headline-md text-headline-md text-on-surface font-black">
                    {Math.round((categoryData[0].value / totalMonthlySpending) * 100)}%
                  </span>
                  <span className="font-label-sm text-[10px] text-outline uppercase truncate max-w-[80px] px-2">{categoryData[0].name}</span>
                </>
              ) : (
                <span className="material-symbols-outlined text-outline">pie_chart</span>
              )}
            </div>
          </div>
          
          <div className="w-full flex flex-col gap-3 overflow-y-auto max-h-[140px] pr-2 custom-scrollbar">
            {categoryData.map((cat, index) => {
              const pct = totalMonthlySpending > 0 ? Math.round((cat.value / totalMonthlySpending) * 100) : 0;
              return (
                <div key={cat.name} className="flex justify-between items-center w-full">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="font-label-sm text-label-sm text-outline truncate max-w-[90px]">{cat.name}</span>
                  </div>
                  <span className="font-label-sm text-label-sm text-on-surface font-bold">{pct}%</span>
                </div>
              );
            })}
            {categoryData.length === 0 && (
              <div className="text-center text-outline font-body-sm py-4">No data to display</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
