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
import { fetchTags, createTag, updateTag, deleteTag } from '@/hooks/useTags';
import { toast } from 'sonner';
import type { Tag } from '@/lib/database.types';

export function TagsManager() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Tag | null>(null);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');

  const load = async () => {
    try {
      const data = await fetchTags();
      setTags(data);
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

  const openEdit = (tag: Tag) => {
    setEditing(tag);
    setName(tag.name);
    setSlug(tag.slug);
    setDialogOpen(true);
  };

  const handleSave = async () => {
    if (!name.trim() || !slug.trim()) {
      toast.error('名称和 Slug 不能为空');
      return;
    }

    try {
      if (editing) {
        await updateTag(editing.id, { name, slug });
        toast.success('标签已更新');
      } else {
        await createTag({ name, slug });
        toast.success('标签已创建');
      }
      setDialogOpen(false);
      load();
    } catch (err) {
      toast.error('操作失败：' + (err as Error).message);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTag(id);
      toast.success('标签已删除');
      load();
    } catch (err) {
      toast.error('删除失败：' + (err as Error).message);
    }
  };

  if (loading) return <p className="text-gray-400">加载中...</p>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-900">标签管理</h2>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4 mr-1" /> 新建标签
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
          {tags.map((tag) => (
            <TableRow key={tag.id}>
              <TableCell className="font-medium">{tag.name}</TableCell>
              <TableCell className="text-gray-500">{tag.slug}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" size="icon" onClick={() => openEdit(tag)}>
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
                          确定要删除标签「{tag.name}」吗？
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>取消</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDelete(tag.id)}>删除</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
          {tags.length === 0 && (
            <TableRow>
              <TableCell colSpan={3} className="text-center text-gray-400 py-8">暂无标签</TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? '编辑标签' : '新建标签'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">名称</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="React" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="react" />
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
