import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { deletePost, togglePublish, type PostWithRelations } from '@/hooks/usePosts';
import { toast } from 'sonner';

interface PostsTableProps {
  posts: PostWithRelations[];
  onRefresh: () => void;
}

export function PostsTable({ posts, onRefresh }: PostsTableProps) {
  const handleDelete = async (id: string) => {
    try {
      await deletePost(id);
      toast.success('文章已删除');
      onRefresh();
    } catch (err) {
      toast.error('删除失败：' + (err as Error).message);
    }
  };

  const handleTogglePublish = async (id: string, currentlyPublished: boolean) => {
    try {
      await togglePublish(id, !currentlyPublished);
      toast.success(currentlyPublished ? '文章已下架' : '文章已发布');
      onRefresh();
    } catch (err) {
      toast.error('操作失败：' + (err as Error).message);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>标题</TableHead>
          <TableHead>分类</TableHead>
          <TableHead>状态</TableHead>
          <TableHead>日期</TableHead>
          <TableHead className="text-right">操作</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <TableRow key={post.id}>
            <TableCell className="font-medium">{post.title}</TableCell>
            <TableCell>{post.categories?.name ?? '-'}</TableCell>
            <TableCell>
              <button
                onClick={() => handleTogglePublish(post.id, post.published)}
                className={`px-2 py-1 rounded-full text-xs font-medium cursor-pointer transition-colors ${
                  post.published
                    ? 'bg-green-100 text-green-700 hover:bg-green-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {post.published ? '已发布' : '草稿'}
              </button>
            </TableCell>
            <TableCell className="text-sm text-gray-500">
              {post.published_at
                ? new Date(post.published_at).toLocaleDateString('zh-CN')
                : new Date(post.created_at).toLocaleDateString('zh-CN')}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button variant="ghost" size="icon" asChild>
                  <Link to={`/admin/posts/${post.id}/edit`}>
                    <Pencil className="h-4 w-4" />
                  </Link>
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
                        确定要删除「{post.title}」吗？此操作不可撤销。
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(post.id)}>
                        删除
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </TableCell>
          </TableRow>
        ))}
        {posts.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-gray-400 py-8">
              暂无文章
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
