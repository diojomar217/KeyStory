import React, { useState } from 'react';

interface PayMongoButtonProps {
  amount: number;
  websiteName: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  preferredMethod?: 'gcash' | 'card' | 'grab_pay';
  orderId?: string;
  className?: string;
}

const PayMongoButton: React.FC<PayMongoButtonProps> = ({
  amount,
  websiteName,
  customerName = '',
  customerEmail = '',
  customerPhone = '',
  preferredMethod = 'gcash',
  orderId = '',
  className = '',
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState(customerEmail || '');
  const [touched, setTouched] = useState(false);

  const handlePay = async () => {
    setTouched(true);
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError('A valid email is required.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/paymongo/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          websiteName,
          customerName,
          customerEmail: email,
          customerPhone,
          preferredMethod,
          orderId,
        }),
      });
      const data = await res.json();
      if (data.success && data.checkoutUrl) {
        window.open(data.checkoutUrl, '_blank');
      } else {
        setError(data.message || 'Unable to start payment.');
      }
    } catch (err) {
      setError('Unable to start payment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={className}>
      <input
        type="email"
        className="mb-2 px-3 py-2 border rounded w-full text-sm"
        placeholder="Your email (required for receipt)"
        value={email}
        onChange={e => setEmail(e.target.value)}
        onBlur={() => setTouched(true)}
        required
        aria-label="Email address"
      />
      <button
        type="button"
        disabled={loading}
        onClick={handlePay}
        className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold shadow-sm bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:ring-offset-2 transition ${loading ? 'opacity-60 cursor-not-allowed' : ''}`}
      >
        {loading ? 'Processing...' : 'Restore via PayMongo'}
      </button>
      {error && <div className="mt-2 text-sm text-red-600">{error}</div>}
    </div>
  );
};

export default PayMongoButton;
