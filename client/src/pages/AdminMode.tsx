import { useFields, Field, FieldType } from '@/contexts/FieldsContext';
import AdminHeader from '@/components/AdminHeader';
import { useState } from 'react';
import { Trash2, Plus, Edit2, X } from 'lucide-react';

export default function AdminMode() {
  const { fields, services, addField, updateField, deleteField, addService, updateService, deleteService } = useFields();
  const [activeTab, setActiveTab] = useState<'fields' | 'services'>('services');
  const [editingFieldId, setEditingFieldId] = useState<string | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [newField, setNewField] = useState<Omit<Field, 'id'>>({
    name: '',
    label: '',
    type: 'text',
    required: false,
  });
  const [newService, setNewService] = useState<Record<string, any>>({});

  const handleAddField = () => {
    if (newField.name && newField.label) {
      addField(newField);
      setNewField({ name: '', label: '', type: 'text', required: false });
    }
  };

  const handleAddService = () => {
    if (Object.keys(newService).length > 0) {
      const serviceWithId = {
        ...newService,
        id: `service_${Date.now()}`,
      };
      addService(serviceWithId);
      setNewService({});
    }
  };

  const handleUpdateService = (id: string, updates: Record<string, any>) => {
    const service = services.find(s => s.id === id);
    if (service) {
      updateService(id, { ...service, ...updates, id });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <main className="container py-8 max-w-6xl">
        {/* 標籤頁 */}
        <div className="flex gap-4 mb-8 border-b border-border">
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'services'
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            服務管理
          </button>
          <button
            onClick={() => setActiveTab('fields')}
            className={`px-4 py-2 font-semibold transition-colors ${
              activeTab === 'fields'
                ? 'text-accent border-b-2 border-accent'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            欄位設定
          </button>
        </div>

        {/* 服務管理 */}
        {activeTab === 'services' && (
          <div className="space-y-6">
            {/* 新增服務 */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-xl font-bold mb-4">新增服務</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {fields.map(field => (
                  <div key={field.id}>
                    <label className="block text-sm font-semibold mb-2">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        value={newService[field.name] || ''}
                        onChange={(e) => setNewService({ ...newService, [field.name]: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                        rows={3}
                      />
                    ) : field.type === 'checkbox' ? (
                      <input
                        type="checkbox"
                        checked={newService[field.name] || false}
                        onChange={(e) => setNewService({ ...newService, [field.name]: e.target.checked })}
                        className="w-4 h-4"
                      />
                    ) : field.type === 'number' ? (
                      <input
                        type="number"
                        value={newService[field.name] || ''}
                        onChange={(e) => setNewService({ ...newService, [field.name]: parseFloat(e.target.value) })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      />
                    ) : (
                      <input
                        type="text"
                        value={newService[field.name] || ''}
                        onChange={(e) => setNewService({ ...newService, [field.name]: e.target.value })}
                        className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                      />
                    )}
                  </div>
                ))}
              </div>
              <button
                onClick={handleAddService}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                新增服務
              </button>
            </div>

            {/* 服務列表 */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">現有服務</h2>
              {services.map(service => (
                <div key={service.id} className="bg-card rounded-lg p-4 border border-border">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{service.name}</h3>
                      <p className="text-sm text-muted-foreground">{service.description}</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setEditingServiceId(editingServiceId === service.id ? null : service.id)}
                        className="p-2 hover:bg-secondary rounded text-accent"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteService(service.id)}
                        className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded text-destructive"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  {/* 編輯模式 */}
                  {editingServiceId === service.id && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-secondary rounded-lg">
                      {fields.map(field => (
                        <div key={field.id}>
                          <label className="block text-sm font-semibold mb-2">{field.label}</label>
                          {field.type === 'textarea' ? (
                            <textarea
                              value={service[field.name] || ''}
                              onChange={(e) => handleUpdateService(service.id, { [field.name]: e.target.value })}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                              rows={3}
                            />
                          ) : field.type === 'checkbox' ? (
                            <input
                              type="checkbox"
                              checked={service[field.name] || false}
                              onChange={(e) => handleUpdateService(service.id, { [field.name]: e.target.checked })}
                              className="w-4 h-4"
                            />
                          ) : field.type === 'number' ? (
                            <input
                              type="number"
                              value={service[field.name] || ''}
                              onChange={(e) => handleUpdateService(service.id, { [field.name]: parseFloat(e.target.value) })}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                            />
                          ) : (
                            <input
                              type="text"
                              value={service[field.name] || ''}
                              onChange={(e) => handleUpdateService(service.id, { [field.name]: e.target.value })}
                              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                            />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 欄位設定 */}
        {activeTab === 'fields' && (
          <div className="space-y-6">
            {/* 新增欄位 */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <h2 className="text-xl font-bold mb-4">新增欄位</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">欄位名稱（英文）</label>
                  <input
                    type="text"
                    value={newField.name}
                    onChange={(e) => setNewField({ ...newField, name: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    placeholder="如: duration"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">欄位標籤（中文）</label>
                  <input
                    type="text"
                    value={newField.label}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                    placeholder="如: 服務時長"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">欄位類型</label>
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField({ ...newField, type: e.target.value as FieldType })}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                  >
                    <option value="text">文字</option>
                    <option value="number">數字</option>
                    <option value="textarea">長文本</option>
                    <option value="checkbox">勾選框</option>
                    <option value="select">下拉選單</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newField.required}
                      onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-semibold">必填</span>
                  </label>
                </div>
              </div>
              <button
                onClick={handleAddField}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={18} />
                新增欄位
              </button>
            </div>

            {/* 欄位列表 */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold">現有欄位</h2>
              {fields.map(field => (
                <div key={field.id} className="bg-card rounded-lg p-4 border border-border flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold">{field.label}</h3>
                    <p className="text-sm text-muted-foreground">
                      類型: {field.type} {field.required ? '(必填)' : '(選填)'}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteField(field.id)}
                    className="p-2 hover:bg-destructive hover:text-destructive-foreground rounded text-destructive"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
