import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImageUploader } from '@/components/admin/ImageUploader';
import { fetchSettings, updateSettings, getDefaults, type SiteSettings } from '@/hooks/useSiteSettings';
import { toast } from 'sonner';

const FIELDS: { key: string; label: string; group: string; type: 'text' | 'textarea' | 'image' }[] = [
  { key: 'site_name', label: '博客名称', group: '基本信息', type: 'text' },
  { key: 'tagline', label: '欢迎语 / Tagline', group: '基本信息', type: 'text' },
  { key: 'author_name', label: '姓名（首页显示）', group: '个人信息', type: 'text' },
  { key: 'author_bio', label: '个人简介 / Motto', group: '个人信息', type: 'textarea' },
  { key: 'email', label: '邮箱', group: '个人信息', type: 'text' },
  { key: 'avatar', label: '头像', group: '图片', type: 'image' },
  { key: 'welcome_bg', label: '欢迎区背景图', group: '图片', type: 'image' },
  { key: 'profile_bg', label: '个人区背景图', group: '图片', type: 'image' },
  { key: 'github_url', label: 'GitHub 主页 URL', group: '社交链接', type: 'text' },
  { key: 'github_username', label: 'GitHub 用户名', group: '社交链接', type: 'text' },
  { key: 'csdn_url', label: 'CSDN 博客 URL', group: '社交链接', type: 'text' },
];

const GROUPS = ['基本信息', '个人信息', '图片', '社交链接'];

export function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings>(getDefaults());
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (key: string, value: string) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const entries = Object.entries(settings).map(([key, value]) => ({ key, value }));
      await updateSettings(entries);
      toast.success('设置已保存');
    } catch (err) {
      toast.error('保存失败：' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="p-6 text-gray-500">加载中...</div>;
  }

  return (
    <div className="p-6 space-y-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">个人设置</h1>

      {GROUPS.map((group) => (
        <div key={group} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">{group}</h2>
          {FIELDS.filter((f) => f.group === group).map((field) => (
            <div key={field.key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.label}
              </label>
              {field.type === 'text' && (
                <Input
                  value={settings[field.key] ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                />
              )}
              {field.type === 'textarea' && (
                <textarea
                  value={settings[field.key] ?? ''}
                  onChange={(e) => handleChange(field.key, e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
                />
              )}
              {field.type === 'image' && (
                <ImageUploader
                  value={settings[field.key] ?? ''}
                  onChange={(url) => handleChange(field.key, url)}
                />
              )}
            </div>
          ))}
        </div>
      ))}

      <div className="pt-4">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? '保存中...' : '保存设置'}
        </Button>
      </div>
    </div>
  );
}
