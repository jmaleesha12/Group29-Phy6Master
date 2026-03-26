import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Users, BookOpen, Edit2, Save, X, Loader } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { getStudentProfile, updateStudentProfile, createStudentProfile, type StudentProfile, type StudentProfileRequest } from "@/lib/student-api";

const card = "rounded-xl border border-border bg-card p-5 shadow-card";
const fadeIn = { initial: { opacity: 0, y: 15 }, animate: { opacity: 1, y: 0 } };

export default function StudentProfile() {
  const userId = Number(localStorage.getItem("authUserId")) || undefined;
  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasProfile, setHasProfile] = useState(false);

  const [formData, setFormData] = useState<StudentProfileRequest>({
    school: "",
    grade: "",
    address: "",
    parentName: "",
    parentPhoneNumber: "",
    batch: "",
    enrollmentNumber: "",
  });

  useEffect(() => {
    loadProfile();
  }, [userId]);

  const loadProfile = async () => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      
      // Try to fetch profile - if it doesn't exist, user needs to create one
      try {
        // We need the studentId from somewhere. For now, we'll try to load it
        // In a real app, you'd store this in localStorage after first login
        const storedStudentId = localStorage.getItem("studentId");
        if (storedStudentId) {
          const data = await getStudentProfile(storedStudentId);
          setProfile(data);
          setHasProfile(true);
          setFormData({
            school: data.school || "",
            grade: data.grade || "",
            address: data.address || "",
            parentName: data.parentName || "",
            parentPhoneNumber: data.parentPhoneNumber || "",
            batch: "",
            enrollmentNumber: "",
          });
        } else {
          setHasProfile(false);
        }
      } catch (error) {
        setHasProfile(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof StudentProfileRequest, value: string): void => {
    setFormData((prev: StudentProfileRequest) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.school) {
      toast.error("School is required");
      return;
    }

    setIsSaving(true);
    try {
      if (!hasProfile) {
        // Create new profile
        if (!userId) {
          toast.error("User ID not found");
          return;
        }
        const data = await createStudentProfile(userId, formData);
        setProfile(data);
        localStorage.setItem("studentId", String(data.studentId));
        setHasProfile(true);
        toast.success("Profile created successfully!");
      } else {
        // Update existing profile
        if (!profile) {
          toast.error("Profile not found");
          return;
        }
        const data = await updateStudentProfile(String(profile.studentId), formData);
        setProfile(data);
        toast.success("Profile updated successfully!");
      }
      setIsEditing(false);
    } catch (error) {
      const message = error instanceof Error ? error.message : "An error occurred";
      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader className="h-8 w-8 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <motion.div {...fadeIn} className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-foreground">Student Profile</h1>
        {!isEditing && hasProfile && (
          <Button onClick={() => setIsEditing(true)} className="flex items-center gap-2">
            <Edit2 className="h-4 w-4" />
            Edit Profile
          </Button>
        )}
      </motion.div>

      {!hasProfile && !isEditing ? (
        <motion.div {...fadeIn} className={card}>
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h2 className="font-display font-semibold text-foreground mb-2">No Profile Created Yet</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Complete your profile to help us provide a better learning experience.
            </p>
            <Button onClick={() => setIsEditing(true)} className="gradient-cta text-primary-foreground">
              Create Profile
            </Button>
          </div>
        </motion.div>
      ) : isEditing ? (
        <motion.div {...fadeIn} className={card}>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">School *</label>
                <Input
                  value={formData.school}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("school", e.target.value)}
                  placeholder="e.g., ABC High School"
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Grade</label>
                <Input
                  value={formData.grade}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("grade", e.target.value)}
                  placeholder="e.g., A or 10"
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Batch</label>
                <Input
                  value={formData.batch}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("batch", e.target.value)}
                  placeholder="e.g., 2024"
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Enrollment Number</label>
                <Input
                  value={formData.enrollmentNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("enrollmentNumber", e.target.value)}
                  placeholder="e.g., ENR-12345"
                  className="bg-secondary border-border"
                />
              </div>
              <div className="md:col-span-2">
                <label className="text-sm font-medium text-foreground mb-1.5 block">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("address", e.target.value)}
                  placeholder="e.g., 123 Main St, City"
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Parent/Guardian Name</label>
                <Input
                  value={formData.parentName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("parentName", e.target.value)}
                  placeholder="e.g., John Doe"
                  className="bg-secondary border-border"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground mb-1.5 block">Parent/Guardian Phone</label>
                <Input
                  value={formData.parentPhoneNumber}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleInputChange("parentPhoneNumber", e.target.value)}
                  placeholder="e.g., +1234567890"
                  className="bg-secondary border-border"
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 gradient-cta text-primary-foreground font-semibold flex items-center justify-center gap-2"
              >
                {isSaving ? (
                  <>
                    <Loader className="h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Save Profile
                  </>
                )}
              </Button>
              <Button
                onClick={() => setIsEditing(false)}
                variant="outline"
                className="flex-1 flex items-center justify-center gap-2"
              >
                <X className="h-4 w-4" />
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      ) : profile ? (
        <motion.div {...fadeIn} className={card}>
          <div className="space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Email</p>
                  <p className="text-foreground">{profile.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</p>
                  <p className="text-foreground">{profile.phoneNumber || "Not provided"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <BookOpen className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">School</p>
                  <p className="text-foreground">{profile.school}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-primary mt-1" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Grade</p>
                  <p className="text-foreground">{profile.grade || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Address Info */}
            <div className="border-t border-border pt-6">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-primary mt-1" />
                <div className="flex-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-1">Address</p>
                  <p className="text-foreground">{profile.address || "Not provided"}</p>
                </div>
              </div>
            </div>

            {/* Parent Info */}
            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-foreground mb-4">Parent/Guardian Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Name</p>
                    <p className="text-foreground">{profile.parentName || "Not provided"}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Phone</p>
                    <p className="text-foreground">{profile.parentPhoneNumber || "Not provided"}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ) : null}
    </div>
  );
}
