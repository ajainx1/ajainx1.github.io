"use client";
import React, { useState, useEffect } from 'react';
import { CreditCard, QrCode, CheckCircle2, Shield, Upload, Info, ExternalLink, Clipboard, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Product, PaymentSubmission, VMConfig } from './types';
import TiltWrapper from '@/components/3d/TiltWrapper';

interface PaymentPortalProps {
  selectedProduct: Product | null;
  customVmConfig: { config: VMConfig; price: number } | null;
  userEmail?: string;
  onPaymentSubmitted: (submission: PaymentSubmission) => void;
}

export default function PaymentPortal({
  selectedProduct,
  customVmConfig,
  userEmail = '',
  onPaymentSubmitted,
}: PaymentPortalProps) {
  const [email, setEmail] = useState(userEmail);
  const [telegram, setTelegram] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card' | 'Web3'>('UPI');
  const [utrNo, setUtrNo] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [uploadedReceiptName, setUploadedReceiptName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);

  // Sync wallet connection state
  useEffect(() => {
    const checkWallet = () => {
      const savedWallet = localStorage.getItem("web3_wallet_address");
      setWalletAddress(savedWallet);
    };
    checkWallet();
    window.addEventListener("storage", checkWallet);
    return () => window.removeEventListener("storage", checkWallet);
  }, []);

  const triggerConnectWallet = () => {
    const mockAddress = "0x7a2d71100f2e82500000000000000000000093B8";
    localStorage.setItem("web3_wallet_address", mockAddress);
    localStorage.setItem("web3_wallet_balance", "1.42 ETH");
    window.dispatchEvent(new Event("storage"));
  };

  const handleWeb3PaymentSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const mockHash = "0x" + Array.from({length: 40}).map(() => Math.floor(Math.random()*16).toString(16)).join("");
      const submission: PaymentSubmission = {
        id: 'TXN-' + Math.floor(100000 + Math.random() * 900000),
        planId: selectedProduct?.id || 'custom_vm',
        planName: payableTitle,
        amountPaid: payableTotal,
        currency: 'INR',
        paymentMethod: 'Web3',
        utrNo: mockHash,
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
    }, 2000);
  };

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

  const inputClass = "w-full bg-slate-50 border border-black/5 text-slate-900 outline-none px-4 py-3 text-sm font-medium rounded-xl focus:border-blue-300 focus:bg-white shadow-sm transition-colors";

  return (
    <TiltWrapper tiltDeg={5}>
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-[24px] border border-white/60 p-6 sm:p-8 shadow-sm bg-white/60 backdrop-blur-2xl relative overflow-hidden"
    >
      <div className="absolute left-0 bottom-0 opacity-[0.03] pointer-events-none -translate-x-1/4 translate-y-1/4">
         <Shield size={300} className="text-blue-600" />
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-5 mb-8 pb-6 border-b border-black/5 relative z-10">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full bg-slate-100 text-slate-500 border border-black/5 shadow-inner">
            Secure Payment Gateway
          </span>
          <h3 className="text-lg sm:text-xl font-black tracking-widest flex items-center gap-3 uppercase mt-4 text-slate-900 font-title">
            <Shield size={22} className="text-blue-600" />
            Verification Portal
          </h3>
          <p className="text-sm font-medium mt-2 text-slate-500">
            Jumpstreet — A Mangalik and Sons Venture Limited
          </p>
        </div>
        <a
          href="https://ajainx1.github.io"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-full text-xs font-bold tracking-widest text-blue-600 transition-all uppercase flex-shrink-0 bg-blue-50 border border-blue-100 hover:bg-blue-100 shadow-sm"
        >
          Visit Developer Network
          <ExternalLink size={16} />
        </a>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 relative z-10">
        {/* Left: Summary & Payment Options */}
        <div className={paymentMethod === 'Web3' ? "lg:col-span-12 max-w-xl mx-auto w-full space-y-8" : "lg:col-span-5 space-y-8"}>
          {/* Item summary */}
          <div className="p-6 rounded-[20px] border border-black/5 space-y-5 bg-slate-50 shadow-inner">
            <h4 className="text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Selected Item Summary
            </h4>
            <div>
              <span className="text-base font-black block truncate uppercase tracking-widest text-slate-900 font-title">{payableTitle}</span>
              <span className="text-[11px] font-bold mt-1 text-slate-400">
                Ready for automated fulfillment
              </span>
            </div>
            <div className="flex justify-between items-baseline pt-5 border-t border-black/5">
              <span className="text-sm font-bold text-slate-500">Fulfillment Cost</span>
              <div className="text-right">
                <span className="text-3xl font-black text-blue-600 font-title tracking-tight">₹{payableTotal.toLocaleString('en-IN')}</span>
                <span className="text-[11px] block font-bold text-slate-400 mt-1">
                  ~${(payableTotal / 85).toFixed(2)} USD
                </span>
              </div>
            </div>
          </div>

          {/* Payment method toggle */}
          <div className="space-y-4">
            <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500">
              Payment Route
            </label>
            <div className="grid grid-cols-3 gap-2 p-2 rounded-xl bg-slate-100 border border-black/5 shadow-inner">
              {(['UPI', 'Card', 'Web3'] as const).map(method => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-3 rounded-lg text-xs font-bold tracking-widest transition-all flex items-center justify-center gap-2 uppercase ${
                    paymentMethod === method 
                      ? 'bg-white text-slate-900 shadow-md border border-black/5' 
                      : 'text-slate-500 hover:bg-slate-200'
                  }`}
                >
                  {method === 'UPI' && <QrCode size={14} />}
                  {method === 'Card' && <CreditCard size={14} />}
                  {method === 'Web3' && <Wallet size={14} />}
                  {method === 'UPI' && 'UPI'}
                  {method === 'Card' && 'Card'}
                  {method === 'Web3' && 'Web3'}
                </button>
              ))}
            </div>
          </div>

          {/* Payment panels */}
          <AnimatePresence mode="wait">
            {paymentMethod === 'UPI' && (
              <motion.div
                key="upi"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="rounded-[20px] border border-black/5 p-8 space-y-6 bg-slate-50 shadow-inner"
              >
                <div className="flex items-center justify-between text-sm font-bold border-b border-black/5 pb-4 mb-4">
                  <span className="text-slate-500 uppercase tracking-widest">Amount:</span>
                  <span className="text-slate-900 font-black text-lg font-title tracking-tight">₹{payableTotal.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex flex-col items-center gap-4">
                  <div className="bg-white p-4 rounded-[20px] border border-black/5 shadow-md">
                    <img
                      src="/js/upi_qr.jpg"
                      alt="UPI QR Code"
                      className="w-[180px] h-auto object-contain rounded-xl"
                    />
                  </div>
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-2">
                    Scan &amp; Pay via any UPI App
                  </span>
                  
                  <div className="w-full border-t border-black/5 pt-4 mt-2 flex flex-col gap-2.5">
                    <div className="flex items-center justify-between gap-3 text-xs font-medium">
                      <span className="text-slate-500 uppercase tracking-widest font-bold">VPA:</span>
                      <span className="text-slate-900 font-bold">9897577007@upi</span>
                    </div>
                    <div className="flex items-center justify-between gap-3 text-xs font-medium">
                      <span className="text-slate-500 uppercase tracking-widest font-bold">Merchant:</span>
                      <span className="text-slate-900 font-bold">Aditya Jain</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => copyToClipboard('9897577007@upi')}
                    className="w-full mt-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 border border-black/5 bg-white text-slate-500 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 shadow-sm"
                    title="Copy UPI ID"
                  >
                    <Clipboard size={14} />
                    <span>Copy UPI ID</span>
                  </button>
                  <AnimatePresence>
                    {isCopied && (
                      <motion.span
                         initial={{ opacity: 0, y: 5 }}
                         animate={{ opacity: 1, y: 0 }}
                         exit={{ opacity: 0 }}
                         className="text-[10px] font-bold uppercase tracking-widest text-emerald-500"
                      >
                        UPI ID copied!
                      </motion.span>
                    )}
                  </AnimatePresence>
                  <span className="text-[11px] block leading-relaxed font-medium text-slate-500 text-center max-w-[200px]">
                    BHIM, GPay, PhonePe, Paytm, Cred, or any Indian Bank app.
                  </span>
                </div>
              </motion.div>
            )}

            {paymentMethod === 'Card' && (
              <motion.div
                key="card"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="rounded-[20px] border border-black/5 p-8 space-y-5 bg-slate-50 shadow-inner"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest block mb-4 text-slate-500">
                  Secure Card Gateway
                </span>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500">Cardholder Email</label>
                  <input type="text" value={email} disabled className={`${inputClass} opacity-60 bg-slate-100 cursor-not-allowed`} />
                </div>
                <div className="space-y-2">
                  <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500">Card Number</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="4111 2222 3333 4444"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19))}
                      className={inputClass}
                    />
                    <CreditCard size={18} className="absolute right-4 top-3.5 text-slate-400" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500">Expiry</label>
                    <input
                      type="text"
                      placeholder="MM/YY"
                      value={cardExpiry}
                      onChange={e => setCardExpiry(e.target.value.substring(0, 5))}
                      className={`${inputClass} text-center`}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500">CVV</label>
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

            {paymentMethod === 'Web3' && (
              <motion.div
                key="web3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="rounded-[20px] border border-black/5 p-8 space-y-5 bg-slate-50 shadow-inner"
              >
                <span className="text-[11px] font-bold uppercase tracking-widest block mb-4 text-blue-600">
                  Smart Contract Gateway
                </span>
                
                {walletAddress ? (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="text-slate-500">Payable Amount:</span>
                      <span className="text-slate-900 font-black">{(payableTotal / 300000).toFixed(5)} ETH</span>
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold">
                      <span className="text-slate-500">Connected Wallet:</span>
                      <span className="text-emerald-600 font-black">{walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}</span>
                    </div>

                    <div className="space-y-2 pt-3">
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500">Delivery Email</label>
                      <input 
                        type="email" 
                        value={email} 
                        onChange={e => setEmail(e.target.value)} 
                        placeholder="you@example.com" 
                        className={inputClass} 
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500">Telegram Username</label>
                      <input 
                        type="text" 
                        value={telegram} 
                        onChange={e => setTelegram(e.target.value)} 
                        placeholder="@username_fixed" 
                        className={inputClass} 
                      />
                    </div>

                    {requiresShipping && (
                      <div className="space-y-2">
                        <label className="block text-[10px] uppercase font-bold tracking-widest text-slate-500">Shipping Address</label>
                        <textarea 
                          rows={2} 
                          value={deliveryAddress} 
                          onChange={e => setDeliveryAddress(e.target.value)} 
                          placeholder="Enter physical address for shipment" 
                          className={inputClass} 
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleWeb3PaymentSubmit}
                      disabled={isSubmitting || !email || !telegram}
                      className="w-full py-4 rounded-xl font-bold text-xs uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-700 active:scale-95 transition-all flex items-center justify-center gap-3 shadow-md disabled:opacity-50"
                    >
                      {isSubmitting ? "Executing Contract..." : "Authorize Web3 Payment"}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-8 space-y-6">
                    <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-sm mx-auto">
                      No connected Web3 node detected. Please connect your wallet in the header to execute this transaction.
                    </p>
                    <button
                      type="button"
                      onClick={triggerConnectWallet}
                      className="px-6 py-3 rounded-full text-xs font-bold uppercase tracking-widest bg-blue-600 text-white hover:bg-blue-700 shadow-md transition-colors"
                    >
                      Connect Wallet
                    </button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Submission Form */}
        {paymentMethod !== 'Web3' && (
          <form onSubmit={handleSubmitPayment} className="lg:col-span-7 space-y-6 sm:space-y-8">
            <h4 className="text-[11px] font-bold uppercase tracking-widest pb-3 border-b border-black/5 text-slate-500">
              Submit Transaction Reference
            </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Email Address <span className="text-red-500">*</span>
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
            <div className="space-y-2">
              <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                Telegram Username <span className="text-red-500">*</span>
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

          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              UPI UTR / Transaction ID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={utrNo}
              onChange={e => setUtrNo(e.target.value)}
              placeholder="e.g. 412498553201 or TXN_XXXXXX"
              className={inputClass}
            />
            <span className="text-[11px] mt-2 block font-medium text-slate-400">
              Enter the 12-digit reference number visible in your banking app after the transaction.
            </span>
          </div>

          <AnimatePresence>
            {requiresShipping && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="space-y-2"
              >
                <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Shipping Address in India <span className="text-red-500">*</span>
                </label>
                <textarea
                  required
                  value={deliveryAddress}
                  onChange={e => setDeliveryAddress(e.target.value)}
                  placeholder="Complete address, state, city and pincode. Shipped via Delhivery / Bluedart."
                  rows={3}
                  className={`${inputClass} resize-y min-h-[100px]`}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Upload */}
          <div className="space-y-2">
            <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-500">
              Upload Payment Screenshot (Optional)
            </label>
            <div className="border border-dashed border-black/10 rounded-[20px] p-8 text-center relative transition-all bg-white hover:bg-slate-50 group cursor-pointer">
              <input
                type="file"
                accept="image/*"
                onChange={handleSimulatedUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="space-y-4">
                <div className="mx-auto w-14 h-14 rounded-[16px] flex items-center justify-center bg-slate-50 border border-black/5 text-slate-400 group-hover:text-blue-600 group-hover:border-blue-200 transition-colors shadow-sm">
                  <Upload size={22} className={isUploading ? 'animate-bounce text-blue-600' : ''} />
                </div>
                {isUploading ? (
                  <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600 animate-pulse">Parsing file securely...</span>
                ) : uploadedReceiptName ? (
                  <div className="flex items-center justify-center gap-2 text-sm text-emerald-600 font-bold">
                    <CheckCircle2 size={18} />
                    Receipt: {uploadedReceiptName.toUpperCase()}
                  </div>
                ) : (
                  <>
                    <span className="text-xs font-black block uppercase tracking-widest text-slate-900 font-title">
                      Drag &amp; Drop or Click to Upload
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      PNG, JPG — up to 5MB
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="pt-4">
            <motion.button
              whileHover={!isSubmitting ? { scale: 1.01 } : {}}
              whileTap={!isSubmitting ? { scale: 0.99 } : {}}
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-4 font-bold rounded-full text-xs transition-all tracking-widest uppercase flex items-center justify-center gap-3 shadow-md ${
                isSubmitting 
                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed border border-black/5' 
                  : 'bg-slate-900 text-white hover:bg-blue-600 hover:shadow-xl cursor-pointer'
              }`}
            >
              {isSubmitting ? (
                <>
                  <span className="w-5 h-5 rounded-full border-2 border-slate-400 border-t-transparent animate-spin" />
                  Verifying Ledger Hashes...
                </>
              ) : (
                <>
                  <CheckCircle2 size={18} />
                  Submit Payment Verification
                </>
              )}
            </motion.button>
          </div>

          <div className="flex items-start gap-4 p-5 rounded-[16px] border border-blue-100 bg-blue-50/50 text-xs shadow-sm">
            <Info size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed text-slate-600 font-medium">
              All software activation references are manually matched against UPI/Card bank ledgers in real-time.
              Expect confirmation within <strong className="text-slate-900 font-bold">15 minutes</strong>.
            </p>
          </div>
          </form>
        )}
      </div>
    </motion.div>
    </TiltWrapper>
  );
}
