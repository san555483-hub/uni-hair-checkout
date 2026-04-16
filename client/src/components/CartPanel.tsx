import { useCart } from '@/contexts/CartContext';
import { useOrder } from '@/contexts/OrderContext';
import ReceiptDialog from './ReceiptDialog';
import { Trash2, Minus, Plus } from 'lucide-react';
import { useState } from 'react';

interface PaymentMethod {
  id: string;
  name: string;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'cash', name: '現金' },
  { id: 'card', name: '信用卡' },
  { id: 'mobile', name: '行動支付' },
];

export default function CartPanel() {
  const { items, removeItem, updateQuantity, clearCart, total } = useCart();
  const { createOrder } = useOrder();
  const [selectedPayment, setSelectedPayment] = useState<string>('cash');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);

  const handleCheckout = () => {
    if (items.length === 0) return;
    
    setIsCheckingOut(true);
    // 模擬結帳流程
    setTimeout(() => {
      // 創建訂單
      const paymentMethodName = PAYMENT_METHODS.find(m => m.id === selectedPayment)?.name || '現金';
      createOrder(
        items.map(item => ({
          id: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
        })),
        paymentMethodName
      );
      
      // 顯示收據對話框
      setShowReceipt(true);
      clearCart();
      setIsCheckingOut(false);
    }, 500);
  };

  const handleCloseReceipt = () => {
    setShowReceipt(false);
  };

  return (
    <>
      <ReceiptDialog isOpen={showReceipt} onClose={handleCloseReceipt} />
      <div className="w-full h-full bg-card text-card-foreground flex flex-col border-l border-border">
      {/* 標題 */}
      <div className="border-b border-border p-6">
        <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>購物車</h2>
      </div>

      {/* 購物車項目 */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {items.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            <p>購物車是空的</p>
          </div>
        ) : (
          items.map(item => (
            <div key={item.id} className="flex items-center gap-4 bg-secondary rounded-lg p-4">
              <div className="flex-1">
                <h4 className="font-semibold text-sm">{item.name}</h4>
                <p className="text-accent font-bold">NT${item.price}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <Minus size={16} />
                </button>
                <span className="w-6 text-center font-semibold">{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  className="p-1 hover:bg-muted rounded"
                >
                  <Plus size={16} />
                </button>
              </div>
              <button
                onClick={() => removeItem(item.id)}
                className="p-1 hover:bg-destructive hover:text-destructive-foreground rounded text-destructive"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* 分隔線 */}
      <div className="border-t border-border"></div>

      {/* 總金額 */}
      <div className="p-6 border-b border-border">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold">總金額</span>
          <span className="text-accent font-bold text-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>NT${total}</span>
        </div>
      </div>

      {/* 支付方式選擇 */}
      {items.length > 0 && (
        <div className="p-6 border-b border-border">
          <p className="text-sm font-semibold mb-3">支付方式</p>
          <div className="space-y-2">
            {PAYMENT_METHODS.map(method => (
              <label key={method.id} className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="payment"
                  value={method.id}
                  checked={selectedPayment === method.id}
                  onChange={(e) => setSelectedPayment(e.target.value)}
                  className="w-4 h-4"
                />
                <span className="text-sm">{method.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 操作按鈕 */}
      <div className="p-6 space-y-3 border-t border-border">
        <button
          onClick={handleCheckout}
          disabled={items.length === 0 || isCheckingOut}
          className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isCheckingOut ? '處理中...' : '完成結帳'}
        </button>
        {items.length > 0 && (
          <button
            onClick={clearCart}
            className="w-full px-6 py-3 rounded-lg font-semibold transition-all duration-300 border border-border hover:bg-secondary"
          >
            清空購物車
          </button>
        )}
      </div>
    </div>
    </>
  );
}
