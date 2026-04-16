import ServiceCard from '@/components/ServiceCard';
import CartPanel from '@/components/CartPanel';
import { useCart } from '@/contexts/CartContext';
import { SERVICES } from '@/lib/services';
import { ShoppingCart, X } from 'lucide-react';
import { useState, useEffect } from 'react';

/**
 * 美髮店簡易結帳系統首頁
 * 
 * 設計理念：現代簡約 + 溫暖親和
 * - 暖米白背景 + 深棕色文字
 * - 柔和玫瑰金色強調重要操作
 * - 響應式卡片網格佈局
 * - 實時購物車更新
 */
export default function Home() {
  const { items } = useCart();
  const [showCart, setShowCart] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-background">
      {/* 導航欄 */}
      <header className="sticky top-0 z-30 bg-card text-card-foreground border-b border-border shadow-sm">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>Salon Luna</h1>
            <p className="text-xs md:text-sm text-muted-foreground">美髮店簡易結帳系統</p>
          </div>
          <button
            onClick={() => setShowCart(!showCart)}
            className="flex items-center gap-2 bg-accent text-accent-foreground px-3 md:px-4 py-2 rounded-lg font-semibold hover:shadow-lg transition-all"
          >
            <ShoppingCart size={20} />
            <span className="text-sm md:text-base">{cartCount}</span>
          </button>
        </div>
      </header>

      {/* 主要內容 */}
      <main className={`container py-8 md:py-12 ${!isMobile && items.length > 0 ? 'pr-96' : ''}`}>
        {/* 標題區 */}
        <div className="mb-8 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 md:mb-3" style={{ fontFamily: 'Playfair Display, serif' }}>我們的服務</h2>
          <p className="text-muted-foreground text-sm md:text-lg">選擇您需要的服務，立即結帳</p>
        </div>

        {/* 服務項目網格 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {SERVICES.map(service => (
            <ServiceCard
              key={service.id}
              id={service.id}
              name={service.name}
              description={service.description}
              price={service.price}
            />
          ))}
        </div>

        {/* 下部提示 */}
        <div className="mt-12 md:mt-16 p-6 md:p-8 bg-secondary rounded-lg text-center">
          <p className="text-muted-foreground text-sm md:text-base">
            {items.length > 0 
              ? `已選擇 ${items.reduce((sum, item) => sum + item.quantity, 0)} 項服務，請在${isMobile ? '下方' : '右側'}購物車確認並完成結帳`
              : '選擇您需要的服務項目'
            }
          </p>
        </div>
      </main>

      {/* 購物車面板 - 行動裝置抽屜 */}
      {isMobile && showCart && items.length > 0 && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 h-screen w-full max-w-md shadow-lg flex flex-col">
            <button
              onClick={() => setShowCart(false)}
              className="absolute top-4 right-4 p-2 hover:bg-secondary rounded z-10 text-card-foreground"
            >
              <X size={24} />
            </button>
            <div className="flex-1 overflow-y-auto mt-12">
              <CartPanel />
            </div>
          </div>
        </div>
      )}
      {/* 購物車面板 - 桌面版 */}
      {!isMobile && items.length > 0 && (
        <div className="fixed right-0 top-0 h-screen w-96 shadow-lg overflow-hidden">
          <CartPanel />
        </div>
      )}
    </div>
  );
}
