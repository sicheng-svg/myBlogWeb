import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { fetchSettings, updateSettings } from '@/hooks/useSiteSettings';
import { resumeData } from '@/data/resume';
import type { Experience } from '@/data/resume';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';
import { Plus, Trash2, ChevronUp, ChevronDown, Upload, FileText } from 'lucide-react';

interface EducationItem {
  school: string;
  degree: string;
  period: string;
  major: string;
}

export function AdminAbout() {
  const [name, setName] = useState(resumeData.name);
  const [title, setTitle] = useState(resumeData.title);
  const [bio, setBio] = useState(resumeData.bio);
  const [skills, setSkills] = useState<string[]>(resumeData.skills);
  const [experience, setExperience] = useState<Experience[]>(resumeData.experience);
  const [education, setEducation] = useState<EducationItem[]>(resumeData.education);
  const [resumeUrl, setResumeUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings()
      .then((s) => {
        if (s.about_name) setName(s.about_name);
        if (s.about_title) setTitle(s.about_title);
        if (s.about_bio) setBio(s.about_bio);
        try { if (s.about_skills) setSkills(JSON.parse(s.about_skills)); } catch {}
        try { if (s.about_experience) setExperience(JSON.parse(s.about_experience)); } catch {}
        try { if (s.about_education) setEducation(JSON.parse(s.about_education)); } catch {}
        if (s.about_resume_url) setResumeUrl(s.about_resume_url);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings([
        { key: 'about_name', value: name },
        { key: 'about_title', value: title },
        { key: 'about_bio', value: bio },
        { key: 'about_skills', value: JSON.stringify(skills) },
        { key: 'about_experience', value: JSON.stringify(experience) },
        { key: 'about_education', value: JSON.stringify(education) },
        { key: 'about_resume_url', value: resumeUrl },
      ]);
      toast.success('关于我设置已保存');
    } catch (err) {
      toast.error('保存失败：' + (err as Error).message);
    } finally {
      setSaving(false);
    }
  };

  // ── PDF Upload ──
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== 'application/pdf') {
      toast.error('请选择 PDF 文件');
      return;
    }
    setUploading(true);
    try {
      const fileName = `resume-${Date.now()}.pdf`;
      const { data, error } = await supabase.storage
        .from('blog-images')
        .upload(fileName, file, { upsert: true });
      if (error) throw error;
      const { data: urlData } = supabase.storage
        .from('blog-images')
        .getPublicUrl(data.path);
      setResumeUrl(urlData.publicUrl);
      toast.success('PDF 上传成功');
    } catch (err) {
      toast.error('上传失败：' + (err as Error).message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // ── Skills helpers ──
  const addSkill = () => setSkills([...skills, '']);
  const removeSkill = (i: number) => setSkills(skills.filter((_, idx) => idx !== i));
  const updateSkill = (i: number, val: string) => {
    const next = [...skills];
    next[i] = val;
    setSkills(next);
  };

  // ── Experience helpers ──
  const addExperience = () =>
    setExperience([
      ...experience,
      { id: `exp-${Date.now()}`, role: '', company: '', period: '', description: '', highlights: [], techStack: [] },
    ]);
  const removeExperience = (i: number) => setExperience(experience.filter((_, idx) => idx !== i));
  const moveExperience = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= experience.length) return;
    const next = [...experience];
    [next[i], next[j]] = [next[j], next[i]];
    setExperience(next);
  };
  const updateExperience = (i: number, field: string, val: string) => {
    const next = [...experience];
    next[i] = { ...next[i], [field]: val };
    setExperience(next);
  };

  // ── Education helpers ──
  const addEducation = () => setEducation([...education, { school: '', degree: '', period: '', major: '' }]);
  const removeEducation = (i: number) => setEducation(education.filter((_, idx) => idx !== i));
  const updateEducation = (i: number, field: string, val: string) => {
    const next = [...education];
    next[i] = { ...next[i], [field]: val };
    setEducation(next);
  };

  if (loading) return <div className="p-6 text-gray-500">加载中...</div>;

  return (
    <div className="p-6 space-y-8 max-w-3xl">
      <h1 className="text-2xl font-bold text-gray-900">关于我设置</h1>

      {/* ── 基本信息 ── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">基本信息</h2>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">职位头衔</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
          />
        </div>
      </section>

      {/* ── 简历 PDF ── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">简历 PDF</h2>
        <div className="flex items-center gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handlePdfUpload}
            className="hidden"
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
          >
            <Upload className="w-4 h-4 mr-1" />
            {uploading ? '上传中...' : '上传 PDF'}
          </Button>
          {resumeUrl && (
            <a
              href={resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline"
            >
              <FileText className="w-4 h-4" />
              查看当前简历
            </a>
          )}
        </div>
        {resumeUrl && (
          <div>
            <label className="block text-xs text-gray-500 mb-1">简历链接（可手动修改）</label>
            <Input value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} />
          </div>
        )}
      </section>

      {/* ── 技能矩阵 ── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">技能矩阵</h2>
        <p className="text-sm text-gray-500">添加技能名称，将以标签形式展示</p>
        <div className="flex flex-wrap gap-2">
          {skills.map((skill, i) => (
            <div key={i} className="flex items-center gap-1 bg-gray-100 rounded-full pl-3 pr-1 py-1">
              <Input
                value={skill}
                onChange={(e) => updateSkill(i, e.target.value)}
                placeholder="技能名称"
                className="border-0 bg-transparent p-0 h-6 text-sm w-24 focus-visible:ring-0"
              />
              <button onClick={() => removeSkill(i)} className="text-gray-400 hover:text-red-500 p-0.5">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={addSkill}>
          <Plus className="w-4 h-4 mr-1" />
          添加技能
        </Button>
      </section>

      {/* ── 工作经历 ── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">工作经历</h2>
        <div className="space-y-6">
          {experience.map((exp, i) => (
            <div key={exp.id} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">经历 #{i + 1}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveExperience(i, -1)} className="text-gray-400 hover:text-gray-700 p-1">
                    <ChevronUp className="w-4 h-4" />
                  </button>
                  <button onClick={() => moveExperience(i, 1)} className="text-gray-400 hover:text-gray-700 p-1">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  <button onClick={() => removeExperience(i)} className="text-gray-400 hover:text-red-500 p-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">职位</label>
                  <Input value={exp.role} onChange={(e) => updateExperience(i, 'role', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">公司</label>
                  <Input value={exp.company} onChange={(e) => updateExperience(i, 'company', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">时间段</label>
                <Input value={exp.period} onChange={(e) => updateExperience(i, 'period', e.target.value)} placeholder="例: 2023.06 - 至今" />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">描述</label>
                <textarea
                  value={exp.description}
                  onChange={(e) => updateExperience(i, 'description', e.target.value)}
                  rows={2}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">亮点（每行一条）</label>
                <textarea
                  value={exp.highlights.join('\n')}
                  onChange={(e) => {
                    const next = [...experience];
                    next[i] = { ...next[i], highlights: e.target.value.split('\n') };
                    setExperience(next);
                  }}
                  rows={3}
                  className="w-full rounded-md border border-gray-200 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-1"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">技术栈（逗号分隔）</label>
                <Input
                  value={exp.techStack.join(', ')}
                  onChange={(e) => {
                    const next = [...experience];
                    next[i] = { ...next[i], techStack: e.target.value.split(',').map((s) => s.trim()).filter(Boolean) };
                    setExperience(next);
                  }}
                  placeholder="React, TypeScript, Tailwind CSS"
                />
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={addExperience}>
          <Plus className="w-4 h-4 mr-1" />
          添加经历
        </Button>
      </section>

      {/* ── 教育背景 ── */}
      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-gray-800 border-b pb-2">教育背景</h2>
        <div className="space-y-4">
          {education.map((edu, i) => (
            <div key={i} className="border border-gray-200 rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">教育 #{i + 1}</span>
                <button onClick={() => removeEducation(i)} className="text-gray-400 hover:text-red-500">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">学校</label>
                  <Input value={edu.school} onChange={(e) => updateEducation(i, 'school', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">学位</label>
                  <Input value={edu.degree} onChange={(e) => updateEducation(i, 'degree', e.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-500 mb-1">专业</label>
                  <Input value={edu.major} onChange={(e) => updateEducation(i, 'major', e.target.value)} />
                </div>
                <div>
                  <label className="block text-xs text-gray-500 mb-1">时间段</label>
                  <Input value={edu.period} onChange={(e) => updateEducation(i, 'period', e.target.value)} />
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" onClick={addEducation}>
          <Plus className="w-4 h-4 mr-1" />
          添加教育
        </Button>
      </section>

      {/* ── 保存 ── */}
      <div className="pt-4 border-t">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? '保存中...' : '保存设置'}
        </Button>
      </div>
    </div>
  );
}
