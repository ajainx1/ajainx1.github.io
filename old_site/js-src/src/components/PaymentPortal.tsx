import React, { useState } from 'react';
import { CreditCard, QrCode, CheckCircle2, Shield, Upload, Info, ExternalLink, Clipboard } from 'lucide-react';
import { Product, PaymentSubmission, VMConfig } from '../types';

interface PaymentPortalProps {
  selectedProduct: Product | null;
  customVmConfig: { config: VMConfig; price: number } | null;
  userEmail?: string;
  onPaymentSubmitted: (submission: PaymentSubmission) => void;
  isDark: boolean;
}

export default function PaymentPortal({
  selectedProduct,
  customVmConfig,
  userEmail = 'jain.aditya33@gmail.com',
  onPaymentSubmitted,
  isDark,
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

  // Theme tokens
  const cardBg = isDark ? '#111111' : '#ffffff';
  const deepBg = isDark ? '#000' : '#f8f8fa';
  const border = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.07)';
  const textPrimary = isDark ? '#fff' : '#111';
  const textSecondary = isDark ? '#9ca3af' : '#666';
  const textMuted = isDark ? '#4b5563' : '#aaa';
  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: deepBg,
    border: `1px solid ${border}`,
    borderRadius: '2px',
    padding: '10px 12px',
    fontSize: '12px',
    fontFamily: 'var(--font-mono)',
    color: textPrimary,
    outline: 'none',
  };

  return (
    <div
      className="rounded-sm border p-4 sm:p-6 shadow-2xl"
      style={{ background: cardBg, borderColor: border }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-5 pb-5 border-b"
           style={{ borderColor: border }}>
        <div>
          <span
            className="text-[9px] font-mono uppercase px-2.5 py-1 rounded-sm"
            style={{ background: isDark ? 'rgba(255,255,255,0.05)' : '#f0f0f3', color: textSecondary, border: `1px solid ${border}` }}
          >
            Secure Payment Gateway
          </span>
          <h3 className="text-sm font-bold tracking-[0.2em] flex items-center gap-2 uppercase mt-3"
              style={{ color: textPrimary }}>
            <Shield size={16} className="text-blue-400 animate-pulse" />
            Verification Portal
          </h3>
          <p className="text-xs font-mono mt-0.5" style={{ color: textSecondary }}>
            Jumpstreet — A Mangalik and Sons Venture Limited
          </p>
        </div>
        <a
          href="https://ajainx1.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 px-3 py-2 rounded-sm text-xs font-mono font-bold tracking-wider text-blue-400 transition-all uppercase flex-shrink-0"
          style={{ background: deepBg, border: `1px solid ${border}` }}
        >
          Visit ajainx1.github.io
          <ExternalLink size={12} />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

        {/* Left: Summary & Payment Options */}
        <div className="lg:col-span-5 space-y-5">
          {/* Item summary */}
          <div className="p-4 rounded-sm border space-y-3"
               style={{ background: deepBg, borderColor: border }}>
            <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.15em]"
                style={{ color: textMuted }}>
              Selected Item Summary
            </h4>
            <div>
              <span className="text-xs font-bold block truncate uppercase tracking-wide"
                    style={{ color: textPrimary }}>{payableTitle}</span>
              <span className="text-[11px] font-mono" style={{ color: textSecondary }}>
                Ready for automated fulfillment
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-3 border-t font-mono"
                 style={{ borderColor: border }}>
              <span className="text-xs" style={{ color: textSecondary }}>Fulfillment Cost</span>
              <div className="text-right">
                <span className="text-lg font-bold text-blue-400">₹{payableTotal.toLocaleString('en-IN')}</span>
                <span className="text-[10px] block" style={{ color: textMuted }}>
                  ~${(payableTotal / 85).toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

          {/* Payment method toggle */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.15em] mb-2"
                   style={{ color: textSecondary }}>
              Payment Route
            </label>
            <div className="grid grid-cols-2 gap-2 p-1.5 rounded-sm"
                 style={{ background: deepBg, border: `1px solid ${border}` }}>
              {(['UPI', 'Card'] as const).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className="py-2 rounded-sm text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 uppercase"
                  style={{
                    background: paymentMethod === method ? (isDark ? '#fff' : '#111') : 'transparent',
                    color: paymentMethod === method ? (isDark ? '#000' : '#fff') : textSecondary,
                  }}
                >
                  {method === 'UPI' ? <QrCode size={13} /> : <CreditCard size={13} />}
                  {method === 'UPI' ? 'India UPI' : 'Intl. Card'}
                </button>
              ))}
            </div>
          </div>

          {/* UPI QR */}
          {paymentMethod === 'UPI' ? (
            <div
              className="rounded-sm border p-5 text-center space-y-4"
              style={{ background: deepBg, borderColor: border }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] block"
                    style={{ color: textSecondary }}>
                Scan &amp; Pay via any UPI App
              </span>

              {/* QR Code mock */}
              <div
                className="w-44 h-44 mx-auto p-3 shadow-xl flex items-center justify-center animate-glow"
                style={{
                  background: '#fff',
                  border: '2px solid rgba(59,130,246,0.3)',
                  borderRadius: '4px',
                }}
              >
                <div className="w-full h-full border-4 border-dashed flex items-center justify-center relative"
                     style={{ borderColor: '#1a1a1a' }}>
                  <div className="grid grid-cols-5 gap-1 w-32 h-32 p-1 opacity-90">
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
                  <div
                    className="absolute text-[7px] font-mono font-black px-1 py-0.5"
                    style={{ background: '#fff', color: '#111', border: '1px solid #111' }}
                  >
                    JUMPSTREET
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-xs font-mono select-all" style={{ color: textPrimary }}>
                    pay@jumpstreet
                  </span>
                  <button
                    onClick={() => copyToClipboard('pay@jumpstreet')}
                    className="p-1 transition-colors"
                    style={{ color: textMuted }}
                    title="Copy UPI ID"
                  >
                    <Clipboard size={12} />
                  </button>
                </div>
                {isCopied && (
                  <span className="text-[10px] text-blue-400 block font-mono font-bold">
                    UPI ID copied!
                  </span>
                )}
                <span className="text-[10px] block leading-normal font-mono" style={{ color: textMuted }}>
                  BHIM, GPay, PhonePe, Paytm, Cred, or any Indian Bank app.
                </span>
              </div>
            </div>
          ) : (
            <div
              className="rounded-sm border p-5 space-y-3.5"
              style={{ background: deepBg, borderColor: border }}
            >
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] block mb-1"
                    style={{ color: textSecondary }}>
                Secure Card Gateway
              </span>
              <div>
                <label className="block text-[9px] uppercase font-mono mb-1 tracking-wider"
                       style={{ color: textMuted }}>Cardholder Email</label>
                <input type="text" value={email} disabled style={{ ...inputStyle, opacity: 0.5, cursor: 'not-allowed' }} />
              </div>
              <div>
                <label className="block text-[9px] uppercase font-mono mb-1 tracking-wider"
                       style={{ color: textMuted }}>Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="4111 2222 3333 4444"
                    value={cardNumber}
                    onChange={e => setCardNumber(e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19))}
                    style={inputStyle}
                  />
                  <CreditCard size={13} className="absolute right-3 top-3" style={{ color: textMuted }} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] uppercase font-mono mb-1 tracking-wider"
                         style={{ color: textMuted }}>Expiry</label>
                  <input
                    type="text"
                    placeholder="MM/YY"
                    value={cardExpiry}
                    onChange={e => setCardExpiry(e.target.value.substring(0, 5))}
                    style={{ ...inputStyle, textAlign: 'center' }}
                  />
                </div>
                <div>
                  <label className="block text-[9px] uppercase font-mono mb-1 tracking-wider"
                         style={{ color: textMuted }}>CVV</label>
                  <input
                    type="password"
                    placeholder="•••"
                    value={cardCvc}
                    onChange={e => setCardCvc(e.target.value.substring(0, 4))}
                    style={{ ...inputStyle, textAlign: 'center' }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Submission Form */}
        <form onSubmit={handleSubmitPayment} className="lg:col-span-7 space-y-4 sm:space-y-5">
          <h4 className="text-[10px] font-mono font-bold uppercase tracking-[0.15em] pb-1.5 border-b"
              style={{ color: textMuted, borderColor: border }}>
            Submit Transaction Reference
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
                     style={{ color: textSecondary }}>
                Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                style={inputStyle}
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
                     style={{ color: textSecondary }}>
                Telegram Username <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={telegram}
                onChange={e => setTelegram(e.target.value)}
                placeholder="@username_fixed"
                style={inputStyle}
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
                   style={{ color: textSecondary }}>
              UPI UTR / Transaction ID <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={utrNo}
              onChange={e => setUtrNo(e.target.value)}
              placeholder="e.g. 412498553201 or TXN_XXXXXX"
              style={inputStyle}
            />
            <span className="text-[10px] mt-1 block font-mono" style={{ color: textMuted }}>
              Enter the reference number visible in your banking app after the transaction.
            </span>
          </div>

          {requiresShipping && (
            <div className="animate-fade-in-up">
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
                     style={{ color: textSecondary }}>
                Shipping Address in India <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                value={deliveryAddress}
                onChange={e => setDeliveryAddress(e.target.value)}
                placeholder="Complete address, state, city and pincode. Shipped via Delhivery / Bluedart."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
          )}

          {/* Upload */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider mb-1.5"
                   style={{ color: textSecondary }}>
              Upload Payment Screenshot (Optional)
            </label>
            <div
              className="border border-dashed rounded-sm p-5 text-center relative transition-all"
              style={{
                background: deepBg,
                borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.1)',
              }}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleSimulatedUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="space-y-2">
                <div
                  className="mx-auto w-10 h-10 rounded-sm flex items-center justify-center"
                  style={{
                    background: isDark ? '#0d0d0d' : '#f0f0f3',
                    border: `1px solid ${border}`,
                    color: textMuted,
                  }}
                >
                  <Upload size={16} className={isUploading ? 'animate-bounce' : ''} />
                </div>
                {isUploading ? (
                  <span className="text-[11px] font-mono" style={{ color: textMuted }}>Parsing file...</span>
                ) : uploadedReceiptName ? (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-blue-400 font-mono font-bold">
                    <CheckCircle2 size={13} />
                    Receipt: {uploadedReceiptName.toUpperCase()}
                  </div>
                ) : (
                  <>
                    <span className="text-[11px] font-bold block uppercase tracking-wide"
                          style={{ color: isDark ? '#d1d5db' : '#555' }}>
                      Drag &amp; Drop or Click to Upload
                    </span>
                    <span className="text-[9px] font-mono" style={{ color: textMuted }}>
                      PNG, JPG — up to 5MB
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-1">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 font-bold rounded-sm text-xs transition-all tracking-widest uppercase flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
              style={{
                background: isSubmitting ? (isDark ? '#1a1a1a' : '#e8e8ed') : (isDark ? '#fff' : '#111'),
                color: isSubmitting ? textMuted : (isDark ? '#000' : '#fff'),
              }}
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 animate-spin"
                        style={{ borderColor: isDark ? '#333' : '#ccc', borderTopColor: 'transparent' }} />
                  Verifying Ledger Hashes...
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  Submit Payment Verification
                </>
              )}
            </button>
          </div>

          <div
            className="flex items-start gap-2.5 p-3 rounded-sm border font-mono text-[10px]"
            style={{ background: deepBg, borderColor: border }}
          >
            <Info size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="leading-normal" style={{ color: textSecondary }}>
              All software activation references are manually matched against UPI/Card bank ledgers in real-time.
              Expect confirmation within 15 minutes.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
