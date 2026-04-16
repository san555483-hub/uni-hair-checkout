import { useLocation } from 'wouter';
import { ArrowLeft } from 'lucide-react';

export default function AdminHeader() {
  const [, navigate] = useLocation();

  return (
    <header className="sticky top-0 z-30 bg-card text-card-foreground border-b border-border shadow-sm">
      <div className="container py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/')}
            className="p-2 hover:bg-secondary rounded transition-colors"
            title="返回首頁"
          >
            <ArrowLeft size={24} />
          </button>
          <div>
            <h1 className="text-3xl font-bold" style={{ fontFamily: 'Playfair Display, serif' }}>
              管理模式
            </h1>
            <p className="text-sm text-muted-foreground">編輯服務項目與欄位配置</p>
          </div>
        </div>
      </div>
    </header>
  );
}
