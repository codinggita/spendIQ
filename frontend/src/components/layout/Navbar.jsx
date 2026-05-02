import { Link } from 'react-router-dom';
import SpendIQLogo from '../../assets/spendiq-logo.png';

const Navbar = () => {
  return (
    <nav className="h-16 px-lg z-30 bg-surface/80 backdrop-blur-md border-b border-surface-variant flex items-center shrink-0">
      <div className="flex justify-between items-center w-full">
        {/* Left side empty for spacing, since logo is in sidebar now */}
        <div className="flex-1 md:hidden">
            <Link to="/" className="flex items-center gap-sm">
                <img src={SpendIQLogo} alt="SpendIQ Logo" className="h-8 w-auto object-contain" />
                <span className="text-xl font-extrabold text-primary italic tracking-tight">SpendIQ</span>
            </Link>
        </div>
        <div className="hidden md:block flex-1">
            <h1 className="font-headline-md text-headline-md text-on-surface">Welcome Back</h1>
        </div>

        <div className="flex items-center gap-md">
          {/* Search */}
          <div className="clay-input-recessed flex items-center px-4 py-2 rounded-full w-64 bg-surface-container">
            <span className="material-symbols-outlined text-outline mr-2 text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>search</span>
            <input type="text" placeholder="Search transactions..." className="bg-transparent border-none outline-none font-label-md text-label-md w-full placeholder-outline text-on-surface" />
          </div>
          
          {/* Trailing Icons */}
          <div className="flex items-center gap-sm">
            <button className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors">
              <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
            </button>
            <button className="w-10 h-10 rounded-full overflow-hidden border-2 border-surface-container-highest flex items-center justify-center hover:border-primary transition-colors">
                <img alt="User Avatar" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuB_M83_d7HX_tRBDtrL3aDONUjQFvGAjQ5XNnlKRQkurWbA7d_FRLZOO-ndocBrtcX-Y0ogO6_88Uml4ClC_oOnXvITGTfVtiXh8phLZ-XiqImCl_C9CdOfbdaojmAUeXaewCaIL__8ihI22xEhBS9QKFOzDaMjReUUktrkmn-8xPqUZpCbaU_RXRD0gx1wB31P_92FHzG9ckZfe2LjCYhJN2XIDcxQT8HO4WfS6Wg3HsnIFmauv6SqSFyOJkWLlDTRI4UuMy2bpyk" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
