import { useOrder, Order } from '@/contexts/OrderContext';
import { X, Download, Printer } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { useRef } from 'react';

interface ReceiptDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ReceiptDialog({ isOpen, onClose }: ReceiptDialogProps) {
  const { currentOrder } = useOrder();
  const qrRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !currentOrder) return null;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  // 生成 QR Code 內容（完整訂單詳情）
  const qrContent = JSON.stringify({
    orderId: currentOrder.id,
    date: currentOrder.createdAt.toISOString(),
    items: currentOrder.items.map(item => ({
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    total: currentOrder.totalAmount,
    paymentMethod: currentOrder.paymentMethod,
    shop: 'Salon Luna',
  });

  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector('svg') as SVGElement;
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx?.drawImage(img, 0, 0);
        const link = document.createElement('a');
        link.href = canvas.toDataURL('image/png');
        link.download = `receipt_${currentOrder.id}.png`;
        link.click();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-card text-card-foreground rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* 標題欄 */}
        <div className="sticky top-0 flex items-center justify-between p-6 border-b border-border bg-card">
          <h2 className="text-2xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
            訂單收據
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-secondary rounded transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* 內容 */}
        <div className="p-6 space-y-6">
          {/* 店家資訊 */}
          <div className="text-center border-b border-border pb-4">
            <h3 className="text-xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              Salon Luna
            </h3>
            <p className="text-sm text-muted-foreground">美髮店簡易結帳系統</p>
          </div>

          {/* 訂單資訊 */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">訂單編號：</span>
              <span className="font-semibold">{currentOrder.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">日期時間：</span>
              <span className="font-semibold">{formatDate(currentOrder.createdAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">支付方式：</span>
              <span className="font-semibold">{currentOrder.paymentMethod}</span>
            </div>
          </div>

          {/* 服務項目 */}
          <div className="border-t border-b border-border py-4">
            <h4 className="font-semibold mb-3">服務項目</h4>
            <div className="space-y-2">
              {currentOrder.items.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-muted-foreground text-xs">數量: {item.quantity}</div>
                  </div>
                  <div className="text-right font-semibold">
                    NT${(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 總金額 */}
          <div className="bg-secondary rounded-lg p-4">
            <div className="flex justify-between items-center">
              <span className="text-lg font-semibold">總金額：</span>
              <span className="text-2xl font-bold text-accent">
                NT${currentOrder.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center space-y-3">
            <p className="text-sm text-muted-foreground">掃描 QR Code 查看完整訂單詳情</p>
            <div
              ref={qrRef}
              className="p-4 bg-white rounded-lg"
            >
              <QRCodeSVG
                value={qrContent}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
          </div>

          {/* 操作按鈕 */}
          <div className="flex gap-3 pt-4 border-t border-border">
            <button
              onClick={handleDownloadQR}
              className="flex-1 flex items-center justify-center gap-2 bg-secondary text-foreground px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Download size={18} />
              下載 QR Code
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 bg-accent text-accent-foreground px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
            >
              <Printer size={18} />
              列印收據
            </button>
          </div>

          {/* 關閉按鈕 */}
          <button
            onClick={onClose}
            className="w-full bg-secondary text-foreground px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            關閉
          </button>
        </div>
      </div>
    </div>
  );
}
