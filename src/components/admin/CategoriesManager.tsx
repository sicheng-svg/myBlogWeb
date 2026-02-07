import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from '@/components/ui/table';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { fetchCategories, createCategory, updateCategory, deleteCategory } from '@/hooks/useCategories';
import { toast } from 'sonner';
import type { Category } from '@/lib/database.types';

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const load = async () => {
    try {
      const data = await fetchCategories();
      setCategories(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => {
    setEditing(null);
    setName('');
    setSlug('');
    setDialogOpen(true);
  };

  const openEdit = (cat: Category) => {
    setEditing(cat);
    setName(cat.name);
    setSlug(cat.slug);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) {
      toast.error('名称和 Slug 不能为空');
      return;
    }

    try {
      if (editing) {
        await updateCategory(editing.id, { name, slug });
        toast.success('分类已更新');
      } else {
        await createCategory({ name, slug });
        toast.success('分类已创建');
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error('操作失败：' + (err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success('分类已删除');
      load();
    } catch (err) {
      toast.error('删除失败：' + (err as Error).message);
    }
  };

  if (loading) return <p className="text-gray-400">加载中...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">分类管理</h2>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> 新建分类
        </Button>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>名称</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className="text-right">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((cat) => (
            <TableRow key={cat.id}>
              <TableCell className="font-medium">{cat.name}</TableCell>
              <TableCell className="text-gray-500">{cat.slug}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(cat)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>确认删除</AlertDialogTitle>
                        <AlertDialogDescription>
                          确定要删除分类「{cat.name}」吗？
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(cat.id)}>删除</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {categories.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-400 py-8">暂无分类</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? '编辑分类' : '新建分类'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="前端开发" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="frontend" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>取消</Button>
            <Button onClick={handleSave}>保存</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
