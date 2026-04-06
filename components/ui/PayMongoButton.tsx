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

  const handlePay = async () => {
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
          customerEmail,
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
      <button
        type="button"
        onClick={handlePay}
        disabled={loading}
        className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold shadow disabled:opacity-60"
      >
        {loading ? 'Redirecting...' : 'Restore via PayMongo'}
      </button>
      {error && <div className="mt-2 text-xs text-rose-600">{error}</div>}
    </div>
  );
};

export default PayMongoButton;
