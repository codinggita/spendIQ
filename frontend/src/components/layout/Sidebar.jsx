import { NavLink } from 'react-router-dom';
import SpendIQLogo from '../../assets/spendiq-logo.png';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: 'dashboard' },
  { path: '/expenses', label: 'Expenses', icon: 'payments' },
  { path: '/add-expense', label: 'Add Expense', icon: 'add_circle' },
  { path: '/receipt-scanner', label: 'Scan Receipt', icon: 'document_scanner' },
  { path: '/ai', label: 'AI Assistant', icon: 'smart_toy' },
  { path: '/budget', label: 'Budgets', icon: 'account_balance_wallet' },
  { path: '/subscriptions', label: 'Subscriptions', icon: 'event_repeat' },
  { path: '/credit-card', label: 'Credit Cards', icon: 'credit_card' },
];

const Sidebar = () => {
  return (
    <aside className="hidden md:flex flex-col w-64 h-full bg-surface-container-lowest border-r border-surface-variant z-40 shrink-0">
      <div className="p-lg flex items-center gap-sm">
        <img src={SpendIQLogo} alt="SpendIQ Logo" className="h-10 w-auto object-contain" />
        <h2 className="text-xl font-extrabold text-primary tracking-tight italic">SpendIQ</h2>
      </div>
      
      <nav className="flex flex-col gap-xs py-md flex-1 overflow-y-auto px-md">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive
                ? "clay-btn-primary flex items-center px-4 py-3 rounded-xl mx-2 my-1 transition-all duration-300 font-label-md text-label-md"
                : "text-on-surface-variant flex items-center px-4 py-3 hover:bg-surface-container-high rounded-xl mx-2 my-1 hover:translate-x-1 transition-all duration-300 font-label-md text-label-md"
            }
          >
            {({ isActive }) => (
              <>
                <span className={`material-symbols-outlined mr-sm text-[20px] ${isActive ? 'text-on-primary-container' : 'text-outline'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>
                  {item.icon}
                </span>
                <span className={isActive ? 'text-on-primary-container' : 'text-on-surface'}>{item.label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>
      
      <div className="p-md mt-auto border-t border-surface-variant">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive
                ? "clay-btn-primary flex items-center px-4 py-3 rounded-xl mx-2 my-1 transition-all duration-300 font-label-md text-label-md"
                : "text-on-surface-variant flex items-center px-4 py-3 hover:bg-surface-container-high rounded-xl mx-2 my-1 hover:translate-x-1 transition-all duration-300 font-label-md text-label-md"
          }
        >
          {({ isActive }) => (
            <>
              <span className={`material-symbols-outlined mr-sm text-[20px] ${isActive ? 'text-on-primary-container' : 'text-outline'}`} style={{ fontVariationSettings: isActive ? "'FILL' 1" : "'FILL' 0" }}>settings</span>
              <span className={isActive ? 'text-on-primary-container' : 'text-on-surface'}>Settings</span>
            </>
          )}
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
