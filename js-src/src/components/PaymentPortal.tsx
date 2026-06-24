import React, { useState, useEffect } from 'react';
import { CreditCard, QrCode, CheckCircle2, Shield, Upload, Info, ExternalLink, ArrowRight, Clipboard, HelpCircle } from 'lucide-react';
import { Product, PaymentSubmission, VMConfig } from '../types';

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
  onPaymentSubmitted 
}: PaymentPortalProps) {
  
  // Checkout Form States
  const [email, setEmail] = useState(userEmail);
  const [telegram, setTelegram] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'UPI' | 'Card'>('UPI');
  const [utrNo, setUtrNo] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  
  // Credit Card mock inputs
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');

  // Receipt upload simulation
  const [uploadedReceiptName, setUploadedReceiptName] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Compute total payable
  const getPayableDetails = () => {
    let title = 'Custom Package';
    let total = 0;
    let hasVM = false;
    let type = 'bot';

    if (selectedProduct) {
      title = selectedProduct.name;
      total = selectedProduct.price;
      type = selectedProduct.type;
      if (selectedProduct.id.includes('premium') || selectedProduct.id.includes('bundle')) {
        hasVM = true;
      }
    } else if (customVmConfig) {
      title = `Custom Windows Cloud VM (${customVmConfig.config.ram}GB RAM)`;
      total = customVmConfig.price;
      hasVM = true;
      type = 'bundle';
    } else {
      // Default placeholder if none selected yet
      title = 'Bot Fixed - Standard License';
      total = 999;
    }

    return { title, total, hasVM, type };
  };

  const { title: payableTitle, total: payableTotal, hasVM, type: payableType } = getPayableDetails();
  const requiresShipping = payableType === 'hotspot' || payableTitle.toLowerCase().includes('hotspot') || payableTitle.toLowerCase().includes('ultimate');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleSimulatedUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setIsUploading(true);
      const file = e.target.files[0];
      setTimeout(() => {
        setUploadedReceiptName(file.name);
        setIsUploading(false);
        // Autofill a mock UTR number if empty
        if (!utrNo) {
          setUtrNo(Math.floor(100000000000 + Math.random() * 900000000000).toString());
        }
      }, 1000);
    }
  };

  const handleSubmitPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !telegram || !utrNo) {
      alert('Please fill out all required fields: Email, Telegram, and UTR/Transaction Hash.');
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
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        hasVM,
        vmDetails: customVmConfig?.config
      };

      onPaymentSubmitted(submission);
      setIsSubmitting(false);
    }, 1500);
  };

  return (
    <div className="bg-[#111111] border border-white/10 rounded-none p-6 shadow-2xl">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-white/10">
        <div>
          <span className="bg-white/5 text-neutral-300 text-[9px] font-mono uppercase px-2.5 py-1 rounded-none border border-white/10">
            Secure Payment Gateway
          </span>
          <h3 className="text-sm font-bold tracking-[0.2em] text-white mt-3 flex items-center gap-2 uppercase">
            <Shield size={16} className="text-blue-400 animate-pulse" />
            Verification Portal
          </h3>
          <p className="text-xs text-neutral-400">JUMPSTREET - A MANGALIK AND SONS VENTURE LIMITED</p>
        </div>

        {/* Hyperlink to user website */}
        <div className="flex items-center gap-2">
          <a 
            href="https://ajainx1.github.io" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-3.5 py-2 rounded-none bg-black border border-white/10 text-xs font-mono font-bold tracking-wider text-blue-400 hover:text-white hover:border-white/40 transition-all flex items-center gap-1.5 uppercase"
          >
            <span>Visit ajainx1.github.io</span>
            <ExternalLink size={12} />
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Side: Summary & Payment Options */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-black border border-white/10 rounded-none p-4.5 space-y-4">
            <h4 className="text-[10px] font-mono font-bold text-neutral-500 uppercase tracking-[0.15em]">
              Selected Item Summary
            </h4>
            <div>
              <span className="text-xs font-bold text-white block truncate uppercase tracking-wide">{payableTitle}</span>
              <span className="text-[11px] text-neutral-400 font-mono">Ready for automated fulfillment</span>
            </div>

            <div className="flex justify-between items-baseline pt-3 border-t border-white/5 font-mono">
              <span className="text-xs text-neutral-400">Fulfillment Cost</span>
              <div className="text-right">
                <span className="text-lg font-bold text-white">₹{payableTotal.toLocaleString('en-IN')}</span>
                <span className="text-[10px] text-neutral-500 block">~ ${(payableTotal/85).toFixed(2)} USD</span>
              </div>
            </div>
          </div>

          {/* Toggle payment mechanism */}
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-[0.15em] mb-2">
              Select Payment Route
            </label>
            <div className="grid grid-cols-2 gap-2 bg-black p-1.5 rounded-none border border-white/10">
              <button
                type="button"
                onClick={() => setPaymentMethod('UPI')}
                className={`py-2 rounded-none text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 uppercase ${
                  paymentMethod === 'UPI'
                    ? 'bg-white text-black'
                    : 'text-neutral-500 hover:text-neutral-200'
                }`}
              >
                <QrCode size={13} />
                India UPI Code
              </button>
              <button
                type="button"
                onClick={() => setPaymentMethod('Card')}
                className={`py-2 rounded-none text-xs font-bold tracking-wider transition-all flex items-center justify-center gap-1.5 uppercase ${
                  paymentMethod === 'Card'
                    ? 'bg-neutral-800 text-white shadow-md'
                    : 'text-neutral-400 hover:text-neutral-200'
                }`}
              >
                <CreditCard size={13} />
                International Card
              </button>
            </div>
          </div>

          {/* Dynamic Details Render (UPI QR or Card template) */}
          {paymentMethod === 'UPI' ? (
            <div className="bg-black border border-white/10 rounded-none p-5 text-center space-y-4">
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.2em] block">
                SCAN & PAY VIA ANY UPI APP
              </span>

              {/* Simulated QR Code using HTML and CSS */}
              <div className="w-48 h-48 bg-white mx-auto p-3.5 rounded-none shadow-xl relative flex items-center justify-center border border-white/10">
                <div className="w-full h-full border-4 border-dashed border-neutral-900 rounded-none flex items-center justify-center relative">
                  <div className="grid grid-cols-5 gap-1.5 w-40 h-40 opacity-90 p-1">
                    {/* Generates a QR-like grid pattern with high visual realism */}
                    {[...Array(25)].map((_, idx) => (
                      <div 
                        key={idx} 
                        className={`rounded-none ${
                          (idx % 3 === 0 || idx < 5 || idx > 20 || (idx % 5 === 0 && idx < 15)) 
                            ? 'bg-neutral-900' 
                            : 'bg-neutral-200'
                        }`} 
                      />
                    ))}
                  </div>
                  {/* Miniature center logo for brand */}
                  <div className="absolute bg-white border border-neutral-900 p-1 rounded-none text-[8px] font-mono font-bold text-neutral-900 shadow-md">
                    JUMPSTREET
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="text-xs font-mono text-neutral-300 select-all">pay@jumpstreet</span>
                  <button 
                    onClick={() => copyToClipboard('pay@jumpstreet')}
                    className="p-1 text-neutral-500 hover:text-white transition-colors"
                    title="Copy UPI ID"
                  >
                    <Clipboard size={12} />
                  </button>
                </div>
                {isCopied && <span className="text-[10px] text-blue-400 block font-mono font-bold">UPI ID copied!</span>}
                <span className="text-[10px] text-neutral-500 block leading-normal font-mono">
                  Accepted apps: BHIM, GPay, PhonePe, Paytm, Cred, or any Indian Bank app.
                </span>
              </div>
            </div>
          ) : (
            <div className="bg-black border border-white/10 rounded-none p-5 space-y-3.5">
              <span className="text-[10px] font-bold text-neutral-300 uppercase tracking-[0.15em] block mb-1">
                SECURE CARD GATEWAY
              </span>
              
              <div>
                <label className="block text-[9px] text-neutral-500 uppercase font-mono mb-1 tracking-wider">Cardholder Email</label>
                <input 
                  type="text" 
                  value={email}
                  disabled
                  className="w-full bg-neutral-950 border border-white/5 rounded-none p-2.5 text-xs text-neutral-500 cursor-not-allowed font-mono" 
                />
              </div>

              <div>
                <label className="block text-[9px] text-neutral-500 uppercase font-mono mb-1 tracking-wider">Card Number</label>
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="4111 2222 3333 4444" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\W/gi, '').replace(/(.{4})/g, '$1 ').trim().substring(0, 19))}
                    className="w-full bg-neutral-950 border border-white/10 rounded-none p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-white/40 font-mono" 
                  />
                  <CreditCard size={13} className="absolute right-3 top-3.5 text-neutral-500" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[9px] text-neutral-500 uppercase font-mono mb-1 tracking-wider">Expiry Date</label>
                  <input 
                    type="text" 
                    placeholder="MM/YY" 
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(e.target.value.substring(0,5))}
                    className="w-full bg-neutral-950 border border-white/10 rounded-none p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-white/40 text-center font-mono" 
                  />
                </div>
                <div>
                  <label className="block text-[9px] text-neutral-500 uppercase font-mono mb-1 tracking-wider">CVV / CVC</label>
                  <input 
                    type="password" 
                    placeholder="•••" 
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value.substring(0,4))}
                    className="w-full bg-neutral-950 border border-white/10 rounded-none p-2.5 text-xs text-neutral-200 focus:outline-none focus:border-white/40 text-center font-mono" 
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right Side: Submission Verification Form */}
        <form onSubmit={handleSubmitPayment} className="lg:col-span-7 space-y-5">
          <h4 className="text-[10px] font-mono font-bold text-neutral-400 uppercase tracking-[0.15em] pb-1.5 border-b border-white/10">
            Submit Transaction Reference
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Your Email Address <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full bg-black border border-white/10 rounded-none p-3 text-xs text-neutral-200 focus:outline-none focus:border-white/40 font-mono"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Telegram Username <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={telegram}
                onChange={(e) => setTelegram(e.target.value)}
                placeholder="@username_fixed"
                className="w-full bg-black border border-white/10 rounded-none p-3 text-xs text-neutral-200 focus:outline-none focus:border-white/40 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
              12-Digit UPI Transaction ID / UTR or Card Auth Code <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={utrNo}
              onChange={(e) => setUtrNo(e.target.value)}
              placeholder="e.g. 412498553201 or TXN_XXXXXX"
              className="w-full bg-black border border-white/10 rounded-none p-3 text-xs text-neutral-200 font-mono focus:outline-none focus:border-white/40"
            />
            <span className="text-[10px] text-neutral-500 mt-1 block font-mono">
              Enter the reference number visible in your banking app immediately after scanning and completing the transaction.
            </span>
          </div>

          {/* Delivery Address if buying hardware */}
          {requiresShipping && (
            <div className="animate-fade-in">
              <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
                Shipping Address in India <span className="text-rose-500">*</span>
              </label>
              <textarea
                required
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder="Enter complete address, state, city and pincode. Shipped via Delhivery / Bluedart express."
                rows={3}
                className="w-full bg-black border border-white/10 rounded-none p-3 text-xs text-neutral-200 focus:outline-none focus:border-white/40 font-mono"
              />
            </div>
          )}

          {/* Screenshot Upload Simulator */}
          <div>
            <label className="block text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1.5">
              Upload Payment Screenshot (Optional)
            </label>
            <div className="border border-dashed border-white/10 hover:border-white/30 bg-black rounded-none p-5 text-center transition-all relative">
              <input 
                type="file" 
                accept="image/*"
                onChange={handleSimulatedUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
              />
              <div className="space-y-2">
                <div className="mx-auto w-10 h-10 rounded-none bg-neutral-955 flex items-center justify-center text-neutral-400 border border-white/5">
                  <Upload size={16} className={isUploading ? 'animate-bounce' : ''} />
                </div>
                {isUploading ? (
                  <span className="text-[11px] text-neutral-500 block font-mono">Parsing file structures...</span>
                ) : uploadedReceiptName ? (
                  <div className="flex items-center justify-center gap-1.5 text-xs text-blue-400 font-mono font-bold">
                    <CheckCircle2 size={13} />
                    <span>RECEIPT PARSED: {uploadedReceiptName.toUpperCase()}</span>
                  </div>
                ) : (
                  <>
                    <span className="text-[11px] text-neutral-300 font-bold block uppercase tracking-wide">Drag & Drop or Click to Upload Screenshot</span>
                    <span className="text-[9px] text-neutral-500 block font-mono">SUPPORTS PNG, JPG UP TO 5MB</span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Submission button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 bg-white hover:bg-neutral-200 disabled:bg-neutral-900 disabled:text-neutral-600 text-black font-bold rounded-none text-xs transition-all tracking-widest uppercase flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 rounded-full border-2 border-black border-t-transparent animate-spin" />
                  VERIFYING LEDGER HASHES...
                </>
              ) : (
                <>
                  <CheckCircle2 size={14} />
                  SUBMIT PAYMENT VERIFICATION
                </>
              )}
            </button>
          </div>

          <div className="flex items-start gap-2.5 bg-black p-3 rounded-none border border-white/5 font-mono text-[10px]">
            <Info size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-neutral-500 leading-normal font-mono">
              Jumpstreet (a Mangalik and Sons Venture Limited) processes alerts and hardware nodes. All software subscription activation references are manually matched against UPI/Card bank ledgers in real-time. Expect confirmation inside 15 minutes.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
