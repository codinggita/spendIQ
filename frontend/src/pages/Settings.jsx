import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../hooks/useAuth';
import { useTheme } from '../hooks/useTheme';

const Settings = () => {
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  // Local toggles for UI
  const [toggles, setToggles] = useState({
    twoFactor: false,
    biometric: true,
    dataSharing: true,
    publicProfile: false,
    emailSummaries: true,
    budgetAlerts: true
  });

  const handleToggle = (key) => {
    if (key === 'darkMode') {
      toggleTheme();
    } else {
      setToggles(prev => ({ ...prev, [key]: !prev[key] }));
    }
  };

  const handleComingSoon = () => {
    toast('Coming soon!', { icon: '🚧' });
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/login'; // Force reload to clear all states cleanly
  };

  const handleCopy = (text, type) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  const ToggleSwitch = ({ active, onClick }) => (
    <button
      onClick={onClick}
      className={`relative w-14 h-8 rounded-full transition-all duration-300 flex items-center px-1 ${
        active 
          ? 'bg-primary shadow-[inset_2px_2px_6px_rgba(0,0,0,0.2),inset_-2px_-2px_4px_rgba(255,255,255,0.2)]' 
          : 'bg-surface-variant shadow-[inset_2px_2px_6px_rgba(0,0,0,0.1),inset_-2px_-2px_4px_rgba(255,255,255,0.8)]'
      }`}
    >
      <div
        className={`w-6 h-6 rounded-full bg-surface-container-lowest shadow-[1px_1px_3px_rgba(0,0,0,0.3)] transform transition-transform duration-300 ${
          active ? 'translate-x-6' : 'translate-x-0'
        }`}
      />
    </button>
  );

  return (
    <div className="flex-grow pb-xl">
      <div className="max-w-4xl mx-auto space-y-xl">
        
        {/* Page Header with Illustration */}
        <div className="flex items-center justify-between clay-card rounded-xl p-lg mb-8">
            <div>
                <h2 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Settings & Privacy</h2>
                <p className="font-body-md text-body-md text-outline">Manage your account preferences and security protocols securely.</p>
            </div>
            <div className="hidden md:flex w-24 h-24 p-4 rounded-full bg-surface-container-low shadow-[inset_4px_4px_8px_rgba(0,0,0,0.05),inset_-4px_-4px_8px_rgba(255,255,255,0.8)] items-center justify-center text-primary">
                <span className="material-symbols-outlined text-[48px]" style={{ fontVariationSettings: "'FILL' 0" }}>settings_suggest</span>
            </div>
        </div>

        {/* Bento Grid Layout for Sections */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
            
            {/* Profile Section */}
            <section className="clay-card rounded-xl p-lg md:col-span-7 flex flex-col gap-md">
                <div className="flex items-center gap-md border-b border-outline-variant/30 pb-md">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>person</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Personal Profile</h3>
                </div>
                <div className="flex items-center gap-lg py-sm">
                    <div className="relative w-20 h-20 rounded-full p-1 bg-surface-container-lowest shadow-[4px_4px_10px_rgba(0,0,0,0.1),-4px_-4px_10px_#ffffff] flex items-center justify-center text-primary font-headline-lg text-headline-lg bg-primary-container/20">
                         {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                        <button className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md hover:scale-105 transition-transform" onClick={handleComingSoon}>
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                        </button>
                    </div>
                    <div className="flex-1">
                        <label className="block font-label-sm text-label-sm text-outline mb-xs">Full Name</label>
                        <input
                            className="clay-input w-full rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface border-none outline-none opacity-80 cursor-not-allowed"
                            type="text" value={user?.name || 'User'} readOnly />
                    </div>
                </div>
                <div className="space-y-sm">
                    <label className="block font-label-sm text-label-sm text-outline">Email Address</label>
                    <input
                        className="clay-input w-full rounded-lg px-4 py-3 font-body-md text-body-md text-on-surface border-none outline-none opacity-80 cursor-not-allowed"
                        type="email" value={user?.email || 'user@example.com'} readOnly />
                </div>
            </section>

            {/* Appearance Section */}
            <section className="clay-card rounded-xl p-lg md:col-span-5 flex flex-col gap-md">
                <div className="flex items-center gap-md border-b border-outline-variant/30 pb-md">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>palette</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Appearance</h3>
                </div>
                <div className="space-y-lg flex-1 mt-2">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-label-md text-label-md text-on-surface">Dark Mode</h4>
                            <p className="font-label-sm text-label-sm text-outline">Toggle application interface</p>
                        </div>
                        <ToggleSwitch active={isDark} onClick={() => handleToggle('darkMode')} />
                    </div>
                    
                    <div className="pt-sm mt-auto">
                        <button onClick={handleComingSoon} className="w-full py-3 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_rgba(0,0,0,0.05),4px_4px_8px_rgba(0,0,0,0.05)] hover:bg-surface-variant transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">color_lens</span>
                            Theme Options
                        </button>
                    </div>
                </div>
            </section>

            {/* Notifications & Security */}
            <section className="clay-card rounded-xl p-lg md:col-span-6 flex flex-col gap-md">
                <div className="flex items-center gap-md border-b border-outline-variant/30 pb-md">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>notifications</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Notifications</h3>
                </div>
                <div className="space-y-lg pt-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-label-md text-label-md text-on-surface">Email Summaries</h4>
                            <p className="font-label-sm text-label-sm text-outline">Weekly spending digest</p>
                        </div>
                        <ToggleSwitch active={toggles.emailSummaries} onClick={() => handleToggle('emailSummaries')} />
                    </div>
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-label-md text-label-md text-on-surface">Budget Alerts</h4>
                            <p className="font-label-sm text-label-sm text-outline">When exceeding 80% limit</p>
                        </div>
                        <ToggleSwitch active={toggles.budgetAlerts} onClick={() => handleToggle('budgetAlerts')} />
                    </div>
                </div>
            </section>

            <section className="clay-card rounded-xl p-lg md:col-span-6 flex flex-col gap-md">
                <div className="flex items-center gap-md border-b border-outline-variant/30 pb-md">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>security</span>
                    <h3 className="font-headline-md text-headline-md text-on-surface">Security</h3>
                </div>
                <div className="space-y-lg pt-sm flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-label-md text-label-md text-on-surface">Two-Factor Auth</h4>
                            <p className="font-label-sm text-label-sm text-outline">Enhanced account security</p>
                        </div>
                        <ToggleSwitch active={toggles.twoFactor} onClick={() => handleToggle('twoFactor')} />
                    </div>
                    <div className="pt-sm mt-auto">
                        <button onClick={handleComingSoon} className="w-full py-3 rounded-xl bg-surface-container-high text-on-surface font-label-md text-label-md shadow-[inset_2px_2px_4px_#ffffff,inset_-2px_-2px_4px_rgba(0,0,0,0.05),4px_4px_8px_rgba(0,0,0,0.05)] hover:bg-surface-variant transition-colors flex items-center justify-center gap-2">
                            <span className="material-symbols-outlined text-[18px]">key</span>
                            Update Password
                        </button>
                    </div>
                </div>
            </section>

            {/* SMS Sync Setup */}
            <section className="clay-card rounded-xl p-lg md:col-span-12 flex flex-col gap-md border border-primary/20 bg-primary/5">
                <div className="flex items-center gap-md border-b border-outline-variant/30 pb-md">
                    <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0" }}>sms</span>
                    <h3 className="font-headline-md text-headline-md text-primary">SMS Sync Setup</h3>
                </div>
                
                <div className="flex flex-col md:flex-row gap-lg pt-sm">
                  <div className="flex-1 space-y-4">
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      Forward your bank SMS messages to our secure webhook to automatically log expenses.
                    </p>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block font-label-sm text-label-sm text-primary mb-1">Webhook URL</label>
                        <div className="relative">
                          <code className="block w-full p-3 pr-12 bg-surface rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)] text-sm text-on-surface font-mono overflow-x-auto border border-outline-variant/30">
                            https://your-ngrok-url.ngrok.app/api/sms/receive
                          </code>
                          <button 
                            onClick={() => handleCopy('https://your-ngrok-url.ngrok.app/api/sms/receive', 'Webhook URL')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md hover:bg-surface-container flex items-center justify-center text-outline transition-colors"
                            title="Copy URL"
                          >
                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                          </button>
                        </div>
                      </div>
                      <div>
                        <label className="block font-label-sm text-label-sm text-primary mb-1">API Key (Header: x-api-key)</label>
                        <div className="relative">
                          <code className="block w-full p-3 pr-12 bg-surface rounded-lg shadow-[inset_2px_2px_4px_rgba(0,0,0,0.05)] text-sm text-on-surface font-mono overflow-x-auto border border-outline-variant/30">
                            your_secret_api_key_for_sms_forwarder
                          </code>
                          <button 
                            onClick={() => handleCopy('your_secret_api_key_for_sms_forwarder', 'API Key')}
                            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md hover:bg-surface-container flex items-center justify-center text-outline transition-colors"
                            title="Copy API Key"
                          >
                            <span className="material-symbols-outlined text-[18px]">content_copy</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <h4 className="font-label-md text-label-md text-on-surface mb-3">Setup Instructions</h4>
                    <ol className="list-decimal pl-5 space-y-2 font-body-sm text-body-sm text-outline">
                      <li>Install an SMS Forwarder app on your Android device.</li>
                      <li>Add a new rule to forward messages containing bank keywords (e.g., "debited").</li>
                      <li>Set the destination to the Webhook URL above.</li>
                      <li>Add a custom HTTP Header: <code className="bg-surface-container-high px-1 py-0.5 rounded text-on-surface">x-api-key</code> with your API Key.</li>
                    </ol>
                  </div>
                </div>
            </section>

            {/* Logout Zone */}
            <section className="clay-card rounded-xl p-lg md:col-span-12 flex items-center justify-between border-2 border-error-container/50 bg-error-container/10">
                <div>
                    <h3 className="font-headline-md text-headline-md text-error mb-xs">Sign Out</h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">Log out of your account on this device securely.</p>
                </div>
                <button
                    onClick={handleLogout}
                    className="px-6 py-2 rounded-full font-label-md text-label-md text-error bg-surface-container-lowest shadow-[4px_4px_8px_rgba(186,26,26,0.1),-4px_-4px_8px_#ffffff,inset_1px_1px_2px_#ffffff] hover:bg-error hover:text-on-error transition-all duration-300 flex items-center gap-2">
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                    Sign Out
                </button>
            </section>

        </div>
      </div>
    </div>
  );
};

export default Settings;
