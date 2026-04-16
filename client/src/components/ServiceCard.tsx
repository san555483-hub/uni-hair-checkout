import { useCart } from '@/contexts/CartContext';
import { Plus } from 'lucide-react';

interface ServiceCardProps {
  id: string;
  name: string;
  description?: string;
  price: number;
}

export default function ServiceCard({ id, name, description, price }: ServiceCardProps) {
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({ id, name, price });
  };

  return (
    <div className="card-service">
      <div className="flex flex-col h-full">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-card-foreground mb-2">{name}</h3>
          {description && (
            <p className="text-sm text-muted-foreground mb-4">{description}</p>
          )}
        </div>
        <div className="flex items-center justify-between">
          <div className="text-accent font-bold text-2xl" style={{ fontFamily: 'Playfair Display, serif' }}>NT${price}</div>
          <button
            onClick={handleAddToCart}
            className="btn-primary flex items-center gap-2 text-sm"
          >
            <Plus size={18} />
            加入
          </button>
        </div>
      </div>
    </div>
  );
}
