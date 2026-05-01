import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { fetchExpenses } from '../features/expense/expenseSlice';
import { parseManualSMS } from '../services/expenseService';

const ManualSMSInput = () => {
  const [smsText, setSmsText] = useState('');
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleParse = async () => {
    if (!smsText.trim()) {
      toast.error('Please enter an SMS string');
      return;
    }

    setLoading(true);
    try {
      const response = await parseManualSMS({
        message: smsText,
        sender: 'Manual Entry'
      });

      if (response.success && response.data?.parsed) {
        toast.success(`Parsed: ₹${response.data.parsed.amount} at ${response.data.parsed.merchant}`);
        setSmsText('');
        // Refresh the list
        dispatch(fetchExpenses());
      }
    } catch (error) {
      console.error('Failed to parse SMS', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-surface rounded-xl clay-card p-lg mb-xl border border-primary/10">
      <div className="flex items-center gap-md mb-md">
        <span className="material-symbols-outlined text-primary">sms_failed</span>
        <h3 className="font-headline-md text-headline-md text-on-surface">Paste SMS Manually</h3>
      </div>
      <p className="font-body-sm text-body-sm text-on-surface-variant mb-md">
        Missing a transaction? Paste the raw bank SMS below. Our parser will extract the details and save it.
      </p>
      <div className="flex flex-col md:flex-row gap-md">
        <textarea
          className="flex-1 min-h-[80px] p-3 rounded-lg bg-surface-container-lowest border border-outline-variant/30 text-body-md text-on-surface font-mono resize-y focus:outline-none focus:ring-2 focus:ring-primary/30"
          placeholder={`Examples:\n- Paid ₹850 at Starbucks on 12-04-2026\n- INR 1,200 debited for Uber ride\n- Amount: 450 spent at Swiggy via card X4242`}
          value={smsText}
          onChange={(e) => setSmsText(e.target.value)}
          disabled={loading}
        />
        <button
          onClick={handleParse}
          disabled={loading}
          className="clay-btn-primary px-6 py-2 rounded-lg font-label-md text-label-md flex items-center justify-center gap-2 h-fit md:mt-auto"
        >
          {loading ? (
            <span className="material-symbols-outlined animate-spin text-[18px]">refresh</span>
          ) : (
            <span className="material-symbols-outlined text-[18px]">add_task</span>
          )}
          Parse & Add
        </button>
      </div>
    </div>
  );
};

export default ManualSMSInput;
