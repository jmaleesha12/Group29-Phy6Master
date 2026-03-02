import { useState } from "react";
import { motion } from "framer-motion";
import { Plus, Trash2, BookOpen, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import { useCourses, useCreateCourse, useUpdateCourse, useDeleteCourse, type Course } from "@/lib/api";

const SUBJECTS = ["Physics"];
const BATCHES = ["2026 A/L", "2027 A/L", "2028 A/L"];
const TYPES = ["Theory", "Revision", "Paper"];

export default function ClassManagement() {
  const { data: courses = [], isLoading } = useCourses();
  const createCourse = useCreateCourse();
  const updateCourse = useUpdateCourse();
  const deleteCourse = useDeleteCourse();

  const [showAdd, setShowAdd] = useState(false);
  const [newClass, setNewClass] = useState({ title: "", description: "", subject: "", batch: "", type: "", imageUrl: "" });

  const [showEdit, setShowEdit] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleAdd = () => {
    if (!newClass.title) {
      toast.error("Please enter a title");
      return;
    }
    createCourse.mutate(newClass, {
      onSuccess: () => {
        setNewClass({ title: "", description: "", subject: "", batch: "", type: "", imageUrl: "" });
        setShowAdd(false);
        toast.success("Course added successfully!");
      },
      onError: () => toast.error("Failed to add course"),
    });
  };

  const handleEdit = () => {
    if (!editingCourse) return;
    updateCourse.mutate(
      { id: editingCourse.id, title: editingCourse.title, description: editingCourse.description, subject: editingCourse.subject, batch: editingCourse.batch, type: editingCourse.type, imageUrl: editingCourse.imageUrl },
      {
        onSuccess: () => {
          setEditingCourse(null);
          setShowEdit(false);
          toast.success("Course updated!");
        },
        onError: () => toast.error("Failed to update course"),
      },
    );
  };

  const handleDelete = (id: number) => {
    deleteCourse.mutate(id, {
      onSuccess: () => toast.success("Course removed"),
      onError: () => toast.error("Failed to delete course"),
    });
  };

  if (isLoading) {
    return <div className="p-6 text-muted-foreground">Loading courses...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">Class Management</h1>
          <p className="text-muted-foreground mt-1">Manage your courses ({courses.length} total)</p>
        </div>
        <Button onClick={() => setShowAdd(true)} className="gradient-cta text-primary-foreground">
          <Plus className="h-4 w-4 mr-1" /> Add Course
        </Button>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-xl bg-card border border-border p-10 shadow-card text-center">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">No courses yet. Create your first course to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((cls, i) => (
            <motion.div key={cls.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              className="rounded-xl bg-card border border-border p-5 shadow-card">
              <div className="flex items-start justify-between mb-3">
                {cls.subject && (
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-blue-500/10 text-blue-500">{cls.subject}</span>
                )}
                {cls.batch && (
                  <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-500/10 text-green-500">{cls.batch}</span>
                )}
              </div>
              <h3 className="text-sm font-semibold text-foreground mb-2">{cls.title}</h3>
              {cls.description && (
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{cls.description}</p>
              )}
              <div className="flex gap-2 mt-4">
                <Button variant="ghost" size="sm" onClick={() => { setEditingCourse({ ...cls }); setShowEdit(true); }}>
                  <Pencil className="h-3 w-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDelete(cls.id)} className="text-destructive">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Add Course Dialog */}
      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-foreground">Add New Course</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
              <Input value={newClass.title} onChange={(e) => setNewClass({ ...newClass, title: e.target.value })} placeholder="e.g., Physics – Theory | Batch 03" className="bg-secondary border-border" />
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
              <Input value={newClass.description} onChange={(e) => setNewClass({ ...newClass, description: e.target.value })} placeholder="Course description" className="bg-secondary border-border" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Subject</label>
                <Select value={newClass.subject} onValueChange={(v) => setNewClass({ ...newClass, subject: v })}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {SUBJECTS.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Batch</label>
                <Select value={newClass.batch} onValueChange={(v) => setNewClass({ ...newClass, batch: v })}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select batch" />
                  </SelectTrigger>
                  <SelectContent>
                    {BATCHES.map((b) => (
                      <SelectItem key={b} value={b}>{b}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Type</label>
              <Select value={newClass.type} onValueChange={(v) => setNewClass({ ...newClass, type: v })}>
                <SelectTrigger className="bg-secondary border-border">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TYPES.map((t) => (
                    <SelectItem key={t} value={t}>{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-sm font-medium text-foreground mb-1 block">Image URL</label>
              <Input value={newClass.imageUrl} onChange={(e) => setNewClass({ ...newClass, imageUrl: e.target.value })} placeholder="https://example.com/image.jpg" className="bg-secondary border-border" />
            </div>
            <Button onClick={handleAdd} disabled={createCourse.isPending} className="w-full gradient-cta text-primary-foreground">
              {createCourse.isPending ? "Adding..." : "Add Course"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Course Dialog */}
      <Dialog open={showEdit} onOpenChange={setShowEdit}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle className="text-foreground">Edit Course</DialogTitle></DialogHeader>
          {editingCourse && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Title</label>
                <Input value={editingCourse.title} onChange={(e) => setEditingCourse({ ...editingCourse, title: e.target.value })} className="bg-secondary border-border" />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Description</label>
                <Input value={editingCourse.description || ""} onChange={(e) => setEditingCourse({ ...editingCourse, description: e.target.value })} className="bg-secondary border-border" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Subject</label>
                  <Select value={editingCourse.subject || ""} onValueChange={(v) => setEditingCourse({ ...editingCourse, subject: v })}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {SUBJECTS.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-foreground mb-1 block">Batch</label>
                  <Select value={editingCourse.batch || ""} onValueChange={(v) => setEditingCourse({ ...editingCourse, batch: v })}>
                    <SelectTrigger className="bg-secondary border-border">
                      <SelectValue placeholder="Select batch" />
                    </SelectTrigger>
                    <SelectContent>
                      {BATCHES.map((b) => (
                        <SelectItem key={b} value={b}>{b}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Type</label>
                <Select value={editingCourse.type || ""} onValueChange={(v) => setEditingCourse({ ...editingCourse, type: v })}>
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t} value={t}>{t}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1 block">Image URL</label>
                <Input value={editingCourse.imageUrl || ""} onChange={(e) => setEditingCourse({ ...editingCourse, imageUrl: e.target.value })} className="bg-secondary border-border" placeholder="https://example.com/image.jpg" />
              </div>
              <Button onClick={handleEdit} disabled={updateCourse.isPending} className="w-full gradient-cta text-primary-foreground">
                {updateCourse.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
