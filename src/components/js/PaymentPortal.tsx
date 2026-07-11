"use client";
import React, { useState } from 'react';
import { CreditCard, QrCode, CheckCircle2, Shield, Upload, Info, ExternalLink, Clipboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, PaymentSubmission, VMConfig } from './types';

interface PaymentPortalProps {
  selectedProduct: Product | null;
  customVmConfig: { config: VMConfig; price: number } | null;
  userEmail?: string;
  onPaymentSubmitted: (submission: PaymentSubmission) => void;
}

export default function PaymentPortal({
  selectedProduct,
  customVmConfig,
  userEmail = 'jain.aditya33@gmail.com',
  onPaymentSubmitted,
}: PaymentPortalProps) {
  const [email, setEmail] = useState(userEmail);
  const [telegram, setTelegram] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card'>('UPI');
  const [utrNo, setUtrNo] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [uploadedReceiptName, setUploadedReceiptName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const getPayableDetails = () => {
    if (selectedProduct) {
      return {
        title: selectedProduct.name,
        total: selectedProduct.price,
        hasVM: selectedProduct.id.includes('premium') || selectedProduct.id.includes('bundle'),
        type: selectedProduct.type,
      };
    }
    if (customVmConfig) {
      return {
        title: `Custom Windows Cloud VM (${customVmConfig.config.ram}GB RAM)`,
        total: customVmConfig.price,
        hasVM: true,
        type: 'bundle',
      };
    }
    return { title: 'Bot Fixed - Standard License', total: 999, hasVM: false, type: 'bot' };
  };

  const { title: payableTitle, total: payableTotal, hasVM, type: payableType } = getPayableDetails();
  const requiresShipping = payableType === 'hotspot' || payableTitle.toLowerCase().includes('hotspot') || payableTitle.toLowerCase().includes('ultimate');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      setTimeout(() => {
        setUploadedReceiptName(file.name);
        setIsUploading(false);
        if (!utrNo) setUtrNo(Math.floor(100000000000 + Math.random() * 900000000000).toString());
      }, 1000);
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !telegram || !utrNo) {
      alert('Please fill all required fields: Email, Telegram, and UTR/Transaction ID.');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      const submission: PaymentSubmission = {
        id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
        planId: selectedProduct?.id || 'custom_vm',
        planName: payableTitle,
        amountPaid: payableTotal,
        currency: 'INR',
        paymentMethod,
        utrNo,
        email,
        telegramUsername: telegram.startsWith('@') ? telegram : '@' + telegram,
        deliveryAddress: requiresShipping ? deliveryAddress : undefined,
        status: 'pending_verification',
        createdAt: new Date().toLocaleDateString('en-IN', {
          day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
        }),
        hasVM,
        vmDetails: customVmConfig?.config,
      };
      onPaymentSubmitted(submission);
      setIsSubmitting(false);
    }, 1500);
  };

  const inputClass = "w-full bg-[var(--card2)] border border-[var(--border)] text-[var(--fg)] outline-none px-3 py-2.5 text-xs font-mono rounded-lg focus:border-[var(--primary)] transition-colors";

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl border border-[var(--border)] p-4 sm:p-6 shadow-2xl bg-[var(--card)] backdrop-blur-md relative overflow-hidden"
    >
      <div className="absolute left-0 bottom-0 opacity-[0.03] pointer-events-none -translate-x-1/4 translate-y-1/4">
         <Shield size={300} className="text-[var(--primary)]" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-5 border-b border-[var(--border)] relative z-10">
        <div>
          <span className="text-[9px] font-mono uppercase px-2.5 py-1 rounded-md bg-[var(--card2)] text-[var(--muted)] border border-[var(--border)]">
            Secure Payment Gateway
          </span>
          <h3 className="text-sm sm:text-base font-bold tracking-[0.2em] flex items-center gap-2 uppercase mt-3.5 text-[var(--fg)]">
            <Shield size={18} className="text-[var(--primary)]" />
            Verification Portal
          </h3>
          <p className="text-xs font-mono mt-1 text-[var(--muted)]">
            Jumpstreet — A Mangalik and Sons Venture Limited
          </p>
        </div>
        <a
          href="https://ajainx1.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-lg text-xs font-mono font-bold tracking-wider text-[var(--primary)] transition-all uppercase flex-shrink-0 bg-[var(--primary)]/10 border border-[var(--primary)]/20 hover:bg-[var(--primary)]/20"
        >
          Visit Developer Network
          <ExternalLink size={14} />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10 relative z-10">
        {/* Left: Summary & Payment Options */}
        <div className="lg:col-span-5 space-y-6">
          {/* Item summary */}
          <div className="p-5 rounded-xl border border-[var(--border)] space-y-4 bg-[var(--card2)]/50 shadow-inner">
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
              Selected Item Summary
            </h4>
            <div>
              <span className="text-sm font-bold block truncate uppercase tracking-wide text-[var(--fg)]">{payableTitle}</span>
              <span className="text-[11px] font-mono text-[var(--muted)]">
                Ready for automated fulfillment
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-4 border-t border-[var(--border)] font-mono">
              <span className="text-xs text-[var(--muted)]">Fulfillment Cost</span>
              <div className="text-right">
                <span className="text-xl font-bold text-[var(--primary)]">₹{payableTotal.toLocaleString('en-IN')}</span>
                <span className="text-[10px] block text-[var(--muted)]">
                  ~${(payableTotal / 85).toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

          {/* Payment method toggle */}
          <div className="space-y-3">
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] text-[var(--muted)]">
              Payment Route
            </label>
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-lg bg-[var(--card2)] border border-[var(--border)]">
              {(['UPI', 'Card'] as const).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 rounded-md text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 uppercase ${
                    paymentMethod === method 
                      ? 'bg-[var(--fg)] text-[var(--bg)] shadow-md' 
                      : 'text-[var(--muted)] hover:bg-[var(--card)]'
                  }`}
                >
                  {method === 'UPI' ? <QrCode size={14} /> : <CreditCard size={14} />}
                  {method === 'UPI' ? 'India UPI' : 'Intl. Card'}
                </button>
              ))}
            </div>
          </div>

          {/* UPI QR */}
          <AnimatePresence mode="wait">
            {paymentMethod === 'UPI' ? (
              <motion.div
                key="upi"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-xl border border-[var(--border)] p-6 text-center space-y-5 bg-[var(--card2)]"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] block text-[var(--muted)]">
                  Scan &amp; Pay via any UPI App
                </span>

                {/* QR Code mock */}
                <div className="w-48 h-48 mx-auto p-4 shadow-xl flex items-center justify-center bg-white border-2 border-[var(--primary)]/30 rounded-xl relative group">
                  <div className="absolute inset-0 bg-[var(--primary)]/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl" />
                  <div className="w-full h-full border-4 border-dashed border-[#1a1a1a] flex items-center justify-center relative">
                    <div className="grid grid-cols-5 gap-1.5 w-32 h-32 p-1.5 opacity-90">
                      {[...Array(25)].map((_, i) => (
                        <div
                          key={i}
                          className="rounded-sm"
                          style={{
                            background: (i % 3 === 0 || i < 5 || i > 20 || (i % 5 === 0 && i < 15))
                              ? '#111' : '#e5e5e5',
                          }}
                        />
                      ))}
                    </div>
                    <div className="absolute text-[8px] font-mono font-black px-1.5 py-0.5 bg-white text-[#111] border border-[#111]">
                      JUMPSTREET
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-xs font-mono select-all text-[var(--fg)] font-medium">
                      pay@jumpstreet
                    </span>
                    <button
                      type="button"
                      onClick={() => copyToClipboard('pay@jumpstreet')}
                      className="p-1.5 rounded-md text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--primary)] transition-colors"
                      title="Copy UPI ID"
                    >
                      <Clipboard size={14} />
                    </button>
                  </div>
                  <AnimatePresence>
                    {isCopied && (
                      <motion.span 
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-[10px] text-[var(--primary)] block font-mono font-bold"
                      >
                        UPI ID copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="text-[10px] block leading-normal font-mono text-[var(--muted)]">
                    BHIM, GPay, PhonePe, Paytm, Cred, or any Indian Bank app.
                  </span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="rounded-xl border border-[var(--border)] p-6 space-y-4 bg-[var(--card2)]"
              >
                <span className="text-[10px] font-bold uppercase tracking-[0.15em] block mb-2 text-[var(--muted)]">
                  Secure Card Gateway
                </span>
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase font-mono tracking-wider text-[var(--muted)]">Cardholder Email</label>
                  <input type="text" value={email} disabled className={`${inputClass} opacity-50 cursor-not-allowed`} />
                </div>
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase font-mono tracking-wider text-[var(--muted)]">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19))}
                      className={inputClass}
                    />
                    <CreditCard size={14} className="absolute right-3.5 top-3 text-[var(--muted)]" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] uppercase font-mono tracking-wider text-[var(--muted)]">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value.substring(0, 5))}
                      className={`${inputClass} text-center`}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-[9px] uppercase font-mono tracking-wider text-[var(--muted)]">CVV</label>
                    <input
                      type="password"
                      placeholder="•••"
                      value={cardCvc}
                      onChange={e => setCardCvc(e.target.value.substring(0, 4))}
                      className={`${inputClass} text-center`}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Submission Form */}
        <form onSubmit={handleSubmitPayment} className="lg:col-span-7 space-y-5 sm:space-y-6">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] pb-2 border-b border-[var(--border)] text-[var(--muted)]">
            Submit Transaction Reference
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className={inputClass}
              />
            </div>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Telegram Username <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={telegram}
                onChange={e => setTelegram(e.target.value)}
                placeholder="@username_fixed"
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
              UPI UTR / Transaction ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={utrNo}
              onChange={e => setUtrNo(e.target.value)}
              placeholder="e.g. 412498553201 or TXN_XXXXXX"
              className={inputClass}
            />
            <span className="text-[10px] mt-1.5 block font-mono text-[var(--muted)]">
              Enter the 12-digit reference number visible in your banking app after the transaction.
            </span>
          </div>

          <AnimatePresence>
            {requiresShipping && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-1.5"
              >
                <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                  Shipping Address in India <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="Complete address, state, city and pincode. Shipped via Delhivery / Bluedart."
                  rows={3}
                  className={`${inputClass} resize-y min-h-[80px]`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
              Upload Payment Screenshot (Optional)
            </label>
            <div className="border border-dashed border-[var(--border)] rounded-xl p-6 text-center relative transition-all bg-[var(--card2)]/50 hover:bg-[var(--card2)] group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleSimulatedUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="space-y-3">
                <div className="mx-auto w-12 h-12 rounded-lg flex items-center justify-center bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] group-hover:text-[var(--primary)] group-hover:border-[var(--primary)]/30 transition-colors">
                  <Upload size={18} className={isUploading ? 'animate-bounce text-[var(--primary)]' : ''} />
                </div>
                {isUploading ? (
                  <span className="text-[11px] font-mono text-[var(--primary)] animate-pulse">Parsing file securely...</span>
                ) : uploadedReceiptName ? (
                  <div className="flex items-center justify-center gap-2 text-xs text-emerald-400 font-mono font-bold">
                    <CheckCircle2 size={14} />
                    Receipt: {uploadedReceiptName.toUpperCase()}
                  </div>
                ) : (
                  <>
                    <span className="text-[11px] font-bold block uppercase tracking-wide text-[var(--fg)]">
                      Drag &amp; Drop or Click to Upload
                    </span>
                    <span className="text-[9px] font-mono text-[var(--muted)]">
                      PNG, JPG — up to 5MB
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <motion.button
              whileHover={!isSubmitting ? { scale: 1.01 } : {}}
              whileTap={!isSubmitting ? { scale: 0.99 } : {}}
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 font-bold rounded-lg text-xs transition-all tracking-widest uppercase flex items-center justify-center gap-2.5 ${
                isSubmitting 
                  ? 'bg-[var(--card2)] text-[var(--muted)] cursor-not-allowed border border-[var(--border)]' 
                  : 'bg-[var(--fg)] text-[var(--bg)] hover:bg-[var(--primary)] hover:text-white shadow-xl hover:shadow-[var(--primary)]/20 cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-[var(--muted)] border-t-transparent animate-spin" />
                  Verifying Ledger Hashes...
                </>
              ) : (
                <>
                  <CheckCircle2 size={16} />
                  Submit Payment Verification
                </>
              )}
            </motion.button>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg border border-[var(--primary)]/20 bg-[var(--primary)]/5 font-mono text-[10px]">
            <Info size={14} className="text-[var(--primary)] flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed text-[var(--muted)]">
              All software activation references are manually matched against UPI/Card bank ledgers in real-time.
              Expect confirmation within <strong className="text-[var(--fg)] font-medium">15 minutes</strong>.
            </p>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
