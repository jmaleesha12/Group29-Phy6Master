import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, FileText, Trash2, Eye, Plus, Pencil, BookOpen } from "lucide-react";
// Note: Trash2 and Pencil kept for lesson edit/delete; material edit/delete removed for now
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  useCourses, useLessons, useCreateLesson, useUpdateLesson, useDeleteLesson,
  useMaterials, useUploadMaterial, getMaterialDownloadUrl,
  type Lesson,
} from "@/lib/api";

export default function ContentUpload() {
  const { data: courses = [], isLoading: loadingCourses } = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<number | undefined>();
  const { data: lessons = [] } = useLessons(selectedCourseId);
  const { data: materials = [], isLoading: loadingMaterials } = useMaterials(selectedCourseId);
  const uploadMaterial = useUploadMaterial();
  const createLesson = useCreateLesson();
  const updateLesson = useUpdateLesson();
  const deleteLesson = useDeleteLesson();

  // Upload dialog
  const [showUpload, setShowUpload] = useState(false);
  const [newRes, setNewRes] = useState({ title: "", type: "PDF", lessonId: 0, linkUrl: "" });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Lesson dialogs
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [newLesson, setNewLesson] = useState({ title: "", content: "" });
  const [showEditLesson, setShowEditLesson] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);



  const handleUpload = () => {
    if (!newRes.title) { toast.error("Please enter a title"); return; }
    if (!newRes.lessonId) { toast.error("Please select a lesson"); return; }
    if (newRes.type === "LINK") {
      if (!newRes.linkUrl) { toast.error("Please enter a URL"); return; }
    } else {
      if (!selectedFile) { toast.error("Please select a file"); return; }
    }
    uploadMaterial.mutate(
      { lessonId: newRes.lessonId, title: newRes.title, type: newRes.type, file: selectedFile || undefined, linkUrl: newRes.type === "LINK" ? newRes.linkUrl : undefined },
      {
        onSuccess: () => {
          setNewRes({ title: "", type: "PDF", lessonId: 0, linkUrl: "" });
          setSelectedFile(null);
          setShowUpload(false);
          toast.success("Resource uploaded successfully!");
        },
        onError: () => toast.error("Upload failed"),
      },
    );
  };

  const handleAddLesson = () => {
    if (!newLesson.title || !selectedCourseId) { toast.error("Please enter a lesson title"); return; }
    createLesson.mutate(
      { courseId: selectedCourseId, title: newLesson.title, content: newLesson.content },
      {
        onSuccess: () => {
          setNewLesson({ title: "", content: "" });
          setShowAddLesson(false);
          toast.success("Lesson created!");
        },
        onError: () => toast.error("Failed to create lesson"),
      },
    );
  };

  const handleEditLesson = () => {
    if (!editingLesson) return;
    updateLesson.mutate(
      { id: editingLesson.id, title: editingLesson.title, content: editingLesson.content },
      {
        onSuccess: () => {
          setEditingLesson(null);
          setShowEditLesson(false);
          toast.success("Lesson updated!");
        },
        onError: () => toast.error("Failed to update lesson"),
      },
    );
  };

  const handleDeleteLesson = (id: number) => {
    deleteLesson.mutate(id, {
      onSuccess: () => toast.success("Lesson deleted"),
      onError: () => toast.error("Failed to delete lesson"),
    });
  };



  if (loadingCourses) {
    return <div className="p-6 text-muted-foreground">Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Content & Resources</h1>
          <p className="text-muted-foreground mt-1">Manage lessons and upload study materials</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowAddLesson(true)} variant="outline" disabled={!selectedCourseId}>
            <Plus className="h-4 w-4 mr-1" /> Add Lesson
          </Button>
          <Button onClick={() => setShowUpload(true)} className="gradient-cta text-primary-foreground" disabled={!selectedCourseId || lessons.length === 0}>
            <Upload className="h-4 w-4 mr-1" /> Upload Resource
          </Button>
        </div>
      </div>

      {/* Course selector */}
      <div className="flex gap-3 flex-wrap items-center">
        <Select value={selectedCourseId ? String(selectedCourseId) : ""} onValueChange={(v) => setSelectedCourseId(Number(v))}>
          <SelectTrigger className="w-64 bg-secondary border-border"><SelectValue placeholder="Select a course" /></SelectTrigger>
          <SelectContent>
            {courses.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.title}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {!selectedCourseId ? (
        <div className="rounded-xl bg-card border border-border p-10 shadow-card text-center">
          <p className="text-muted-foreground">Select a course above to view its lessons and materials.</p>
        </div>
      ) : (
        <>
          {/* ─── Lessons Section ─── */}
          <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-secondary">
              <div className="flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" />
                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Lessons ({lessons.length})</h2>
              </div>
            </div>
            {lessons.length === 0 ? (
              <div className="p-8 text-center">
                <BookOpen className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No lessons yet. Create your first lesson to start uploading materials.</p>
              </div>
            ) : (
              <div className="divide-y divide-border">
                {lessons.map((l, i) => (
                  <motion.div key={l.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.03 }}
                    className="flex items-center justify-between px-4 py-3 hover:bg-secondary/50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{l.title}</p>
                      {l.content && <p className="text-xs text-muted-foreground truncate mt-0.5">{l.content}</p>}
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button variant="ghost" size="sm" onClick={() => { setEditingLesson({ ...l }); setShowEditLesson(true); }}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleDeleteLesson(l.id)} className="text-destructive">
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>

          {/* ─── Materials Section ─── */}
          {loadingMaterials ? (
            <p className="text-muted-foreground">Loading materials...</p>
          ) : materials.length === 0 ? (
            <div className="rounded-xl bg-card border border-border p-10 shadow-card text-center">
              <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">No materials for this course yet. Upload your first resource.</p>
            </div>
          ) : (
            <div className="rounded-xl bg-card border border-border shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-secondary">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Resource</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Type</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Lesson</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {materials.map((r) => (
                      <tr key={r.id} className="border-b border-border last:border-0 hover:bg-secondary/50 transition-colors">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <FileText className="h-5 w-5 text-red-400" />
                            <p className="text-sm font-medium text-foreground">{r.title}</p>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-sm text-foreground">{r.type}</td>
                        <td className="px-4 py-3 text-sm text-muted-foreground">{r.lesson?.title || "–"}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-1">
                            <a href={r.type === "LINK" ? r.url : getMaterialDownloadUrl(r.id)} target="_blank" rel="noopener noreferrer">
                              <Button variant="ghost" size="sm"><Eye className="h-3 w-3" /></Button>
                            </a>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* ─── Upload Resource Dialog ─── */}
      <Dialog open={showUpload} onOpenChange={setShowUpload}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-foreground">Upload Resource</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Lesson</label>
              <Select value={newRes.lessonId ? String(newRes.lessonId) : ""} onValueChange={(v) => setNewRes({ ...newRes, lessonId: Number(v) })}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue placeholder="Select a lesson" /></SelectTrigger>
                <SelectContent>
                  {lessons.map((l) => <SelectItem key={l.id} value={String(l.id)}>{l.title}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
              <Input value={newRes.title} onChange={(e) => setNewRes({ ...newRes, title: e.target.value })} placeholder="Resource title" className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Type</label>
              <Select value={newRes.type} onValueChange={(v) => setNewRes({ ...newRes, type: v })}>
                <SelectTrigger className="bg-secondary border-border"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="VIDEO">Video</SelectItem>
                  <SelectItem value="NOTE">Note</SelectItem>
                  <SelectItem value="LINK">Link</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {newRes.type === "LINK" ? (
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">URL</label>
                <Input value={newRes.linkUrl} onChange={(e) => setNewRes({ ...newRes, linkUrl: e.target.value })} placeholder="https://example.com/resource" className="bg-secondary border-border" />
              </div>
            ) : (
              <div className="border-2 border-dashed border-border rounded-lg p-8 text-center cursor-pointer"
                onClick={() => fileInputRef.current?.click()}>
                <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                {selectedFile ? (
                  <p className="text-sm text-foreground">{selectedFile.name}</p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground">Click to select a file</p>
                    <p className="text-xs text-muted-foreground mt-1">PDF, DOCX, PNG, JPG, MP4 up to 500MB</p>
                  </>
                )}
                <input ref={fileInputRef} type="file" className="hidden" onChange={(e) => setSelectedFile(e.target.files?.[0] || null)} />
              </div>
            )}
            <Button onClick={handleUpload} disabled={uploadMaterial.isPending} className="w-full gradient-cta text-primary-foreground">
              {uploadMaterial.isPending ? "Uploading..." : "Upload"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Add Lesson Dialog ─── */}
      <Dialog open={showAddLesson} onOpenChange={setShowAddLesson}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-foreground">Create Lesson</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
              <Input value={newLesson.title} onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })} placeholder="Lesson title" className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Content / Description</label>
              <Textarea value={newLesson.content} onChange={(e) => setNewLesson({ ...newLesson, content: e.target.value })} placeholder="Optional description or notes" className="bg-secondary border-border min-h-[100px]" />
            </div>
            <Button onClick={handleAddLesson} disabled={createLesson.isPending} className="w-full gradient-cta text-primary-foreground">
              {createLesson.isPending ? "Creating..." : "Create Lesson"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* ─── Edit Lesson Dialog ─── */}
      <Dialog open={showEditLesson} onOpenChange={setShowEditLesson}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-foreground">Edit Lesson</DialogTitle></DialogHeader>
          {editingLesson && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
                <Input value={editingLesson.title} onChange={(e) => setEditingLesson({ ...editingLesson, title: e.target.value })} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Content / Description</label>
                <Textarea value={editingLesson.content || ""} onChange={(e) => setEditingLesson({ ...editingLesson, content: e.target.value })} className="bg-secondary border-border min-h-[100px]" />
              </div>
              <Button onClick={handleEditLesson} disabled={updateLesson.isPending} className="w-full gradient-cta text-primary-foreground">
                {updateLesson.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>


    </div>
  );
}
