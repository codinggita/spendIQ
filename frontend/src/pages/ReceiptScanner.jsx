import React, { useState, useCallback, useRef } from 'react';
import SEO from '../components/SEO';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';
import { parseReceiptText } from '../utils/receiptParser';
import { addExpense } from '../features/expense/expenseSlice';
import { addExpenseApi } from '../services/expenseService';
import { CATEGORIES } from '../utils/constants';

const ReceiptScanner = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrLog, setOcrLog] = useState('');
  const [rawText, setRawText] = useState('');
  const [showRawText, setShowRawText] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ amount: '', merchant: '', category: 'Other', notes: '' });
  const [formVisible, setFormVisible] = useState(false);

  // Refs for manual triggering if needed, though label/htmlFor is primary
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // ── OCR Engine ────────────────────────────────────────────────────────────
  const runOCR = useCallback(async (imageFile) => {
    setProcessing(true);
    setFormVisible(false);
    setOcrProgress(0);
    setRawText('');
    setOcrLog('Starting OCR...');

    try {
      const { data } = await Tesseract.recognize(imageFile, 'eng', {
        logger: (m) => {
          if (m.status === 'recognizing text') {
            const pct = Math.round((m.progress || 0) * 100);
            setOcrProgress(pct);
            setOcrLog(`Scanning: ${pct}%`);
          } else {
            setOcrLog(m.status);
          }
        },
      });

      const text = data.text || '';
      setRawText(text);
      const parsed = parseReceiptText(text);
      
      setForm({
        amount: parsed.amount ? String(parsed.amount) : '',
        merchant: parsed.merchant || '',
        category: parsed.category || 'Other',
        notes: '',
      });
      setFormVisible(true);
      toast.success('Scan complete! Please review.');
    } catch (err) {
      console.error('OCR Error:', err);
      toast.error('Could not read receipt. Please enter details manually.');
      setForm({ amount: '', merchant: '', category: 'Other', notes: '' });
      setFormVisible(true);
    } finally {
      setProcessing(false);
    }
  }, []);

  // ── File Handling ─────────────────────────────────────────────────────────
  const onFileReady = (selected) => {
    if (!selected) return;
    if (!selected.type.startsWith('image/')) {
      toast.error('Invalid file type. Please upload an image.');
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    runOCR(selected);
  };

  const handleInputChange = (e) => {
    onFileReady(e.target.files[0]);
    e.target.value = ''; // Reset
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    onFileReady(e.dataTransfer.files[0]);
  };

  const clearAll = () => {
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setFormVisible(false);
    setRawText('');
    setForm({ amount: '', merchant: '', category: 'Other', notes: '' });
  };

  // ── Save Action ───────────────────────────────────────────────────────────
  const saveExpense = async () => {
    if (!form.amount || !form.merchant) {
      toast.error('Amount and Merchant are required');
      return;
    }
    setSaving(true);
    const payload = {
      amount: parseFloat(form.amount),
      merchant: form.merchant,
      category: form.category || 'Other',
      notes: form.notes || '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0]
    };

    try {
      const result = await addExpenseApi(payload);
      // Dispatch to Redux so list updates instantly (works offline too)
      const savedExpense = result?.data?.expense || { ...payload, id: Date.now().toString() };
      dispatch(addExpense(savedExpense));
      toast.success('Receipt expense saved! 🎉');
      navigate('/expenses');
    } catch (err) {
      console.error('Failed to save receipt:', err);
      toast.error('Could not save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-grow pb-10">
      <SEO 
        title="Receipt Scanner" 
        description="Scan your physical receipts and let SpendIQ AI extract the merchant, amount, and category for you automatically." 
      />
      {/* Hidden inputs linked to labels */}
      <input 
        id="file-upload" 
        type="file" 
        accept="image/*" 
        className="hidden" 
        onChange={handleInputChange} 
      />
      <input 
        id="camera-capture" 
        type="file" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        onChange={handleInputChange} 
      />

      <header className="flex justify-between items-center mb-8">
        <div className="space-y-2">
          <h2 className="text-4xl font-black text-on-background tracking-tight">Scan Receipt</h2>
          <p className="text-outline text-lg font-medium">Extract transaction details automatically.</p>
        </div>
        <button 
          onClick={() => navigate('/expenses')}
          className="px-5 py-2 rounded-full bg-surface-container shadow-clay flex items-center gap-2 font-bold text-primary"
        >
          <span className="material-symbols-outlined">arrow_back</span>
          Back
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Side: Image / Upload */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          {!file ? (
            <div 
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`min-h-[400px] rounded-[40px] border-4 border-dashed flex flex-col items-center justify-center text-center p-10 transition-all ${
                isDragging ? 'border-primary bg-primary/5 scale-102' : 'border-outline-variant bg-surface-container-low shadow-clay-inner'
              }`}
            >
              <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-6 shadow-clay">
                <span className="material-symbols-outlined text-[48px] text-primary">document_scanner</span>
              </div>
              <h3 className="text-2xl font-bold text-on-surface mb-2">Upload Receipt</h3>
              <p className="text-outline mb-10 leading-relaxed">
                Take a photo or drag a file here. Best results with clear, well-lit photos.
              </p>

              <div className="flex gap-4">
                <label 
                  htmlFor="file-upload"
                  className="px-8 py-4 rounded-2xl bg-primary text-white font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-lg flex items-center gap-2"
                >
                  <span className="material-symbols-outlined">upload_file</span>
                  Browse Files
                </label>
                <label 
                  htmlFor="camera-capture"
                  className="px-8 py-4 rounded-2xl bg-white text-on-surface font-bold cursor-pointer hover:scale-105 active:scale-95 transition-all shadow-clay flex items-center gap-2 border border-surface-variant/30"
                >
                  <span className="material-symbols-outlined">photo_camera</span>
                  Use Camera
                </label>
              </div>
            </div>
          ) : (
            <div className="relative rounded-[40px] overflow-hidden shadow-clay bg-surface min-h-[400px] flex items-center justify-center group">
              <img src={preview} alt="Receipt" className="max-w-full max-h-[600px] object-contain" />
              <button 
                onClick={clearAll}
                className="absolute top-6 right-6 w-12 h-12 rounded-full bg-surface/80 backdrop-blur shadow-lg flex items-center justify-center text-error opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <span className="material-symbols-outlined">close</span>
              </button>
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <label htmlFor="file-upload" className="px-4 py-2 bg-primary/90 text-white rounded-full text-sm font-bold cursor-pointer shadow-lg flex items-center gap-1">
                  <span className="material-symbols-outlined text-sm">refresh</span> Replace
                </label>
              </div>
            </div>
          )}

          {/* OCR Logs */}
          {processing && (
            <div className="p-6 rounded-3xl bg-surface shadow-clay border border-primary/10">
              <div className="flex items-center justify-between mb-4">
                <span className="font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined animate-spin text-primary">sync</span>
                  {ocrLog}
                </span>
                <span className="text-primary font-bold">{ocrProgress}%</span>
              </div>
              <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${ocrProgress}%` }}
                />
              </div>
            </div>
          )}

          {rawText && !processing && (
            <div className="rounded-[32px] bg-surface shadow-clay border border-surface-variant/30 p-6 mt-4">
              <button 
                onClick={() => setShowRawText(!showRawText)}
                className="w-full flex justify-between items-center text-primary font-bold text-sm uppercase tracking-widest"
              >
                <span>Raw Text Extraction</span>
                <span className="material-symbols-outlined">{showRawText ? 'expand_less' : 'expand_more'}</span>
              </button>
              {showRawText && (
                <div className="mt-4 p-5 bg-surface-container-low rounded-2xl font-mono text-[11px] leading-relaxed whitespace-pre-wrap max-h-48 overflow-y-auto text-outline border border-surface-variant/20 shadow-inner">
                  {rawText}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Form */}
        <div className="lg:col-span-5">
          <div className="sticky top-24 bg-surface rounded-[40px] p-8 shadow-clay border border-white/50">
            <h3 className="text-xl font-black text-on-surface mb-8 flex items-center gap-2 uppercase tracking-widest opacity-80">
              <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
              Extracted Data
            </h3>

            {!file && !processing ? (
              <div className="flex flex-col items-center justify-center text-center py-10 opacity-50">
                <span className="material-symbols-outlined text-[64px] mb-4">receipt_long</span>
                <p className="font-bold">No receipt scanned</p>
                <p className="text-sm">Upload a photo to see results</p>
              </div>
            ) : processing ? (
              <div className="space-y-6 animate-pulse">
                {[1,2,3,4].map(i => <div key={i} className="h-14 bg-surface-container rounded-2xl" />)}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-black text-outline uppercase tracking-widest ml-2">Merchant</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">storefront</span>
                    <input 
                      type="text" 
                      value={form.merchant}
                      onChange={(e) => setForm({...form, merchant: e.target.value})}
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-surface-container-low shadow-clay-inner outline-none focus:ring-2 focus:ring-primary/20 border-none font-bold"
                      placeholder="e.g. Starbucks"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black text-outline uppercase tracking-widest ml-2">Amount (₹)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-black text-primary text-lg">₹</span>
                    <input 
                      type="number" 
                      value={form.amount}
                      onChange={(e) => setForm({...form, amount: e.target.value})}
                      className="w-full h-14 pl-12 pr-4 rounded-2xl bg-surface-container-low shadow-clay-inner outline-none focus:ring-2 focus:ring-primary/20 border-none font-black text-xl text-primary"
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <label className="text-xs font-black text-outline uppercase tracking-widest ml-2">Category</label>
                  <div className="relative mt-2">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline">category</span>
                    <select 
                      value={form.category}
                      onChange={(e) => setForm({...form, category: e.target.value})}
                      className="w-full h-14 pl-12 pr-10 rounded-2xl bg-surface-container-low shadow-clay-inner outline-none focus:ring-2 focus:ring-primary/20 border-none font-bold appearance-none cursor-pointer text-on-surface"
                    >
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-outline pointer-events-none">expand_more</span>
                  </div>
                </div>

                <div className="pt-6 flex gap-4">
                  <button 
                    onClick={clearAll}
                    className="flex-1 h-16 rounded-3xl font-bold text-outline hover:bg-surface-container transition-colors"
                  >
                    Discard
                  </button>
                  <button 
                    onClick={saveExpense}
                    disabled={saving}
                    className="flex-[2] h-16 rounded-3xl bg-primary text-white font-bold flex items-center justify-center gap-2 shadow-lg hover:brightness-110 active:scale-95 transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <span className="material-symbols-outlined animate-spin">sync</span>
                    ) : (
                      <>
                        <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>save</span>
                        Save Expense
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptScanner;
