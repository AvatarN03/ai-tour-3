import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAuth } from "@/context/useAuth";
import {
  LogOut,
  User,
  Mail,
  Calendar,
  Heart,
  Camera,
  Edit2,
  X,
  Loader2,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { getUserInitials } from "@/lib/nameInitial";
import { toast } from "sonner";
import { preferenceColors } from "@/lib/constant";
import { formatDate } from "@/lib/utils";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";

const ProfileCard = ({ modal, setModal }) => {
  const { profile, logout, updateProfilePicture, updatePreferences, user } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileRef = useRef(null);
  const [editPrefs, setEditPrefs] = useState(false);
  const [prefs, setPrefs] = useState([]);
  const [savingPrefs, setSavingPrefs] = useState(false);
  
  // Stats state
  const [stats, setStats] = useState({
    trips: 0,
    blogPosts: 0,
    loading: true
  });

  useEffect(() => {
    if (profile?.preferences) {
      setPrefs(profile.preferences);
    }
  }, [profile?.preferences]);

  // Fetch stats when modal opens
  useEffect(() => {
    const fetchStats = async () => {
      if (!user?.uid || !modal) return;

      setStats(prev => ({ ...prev, loading: true }));

      try {
        // Fetch trips count
        const tripsRef = collection(db, "trips");
        const tripsQuery = query(tripsRef, where("userId", "==", user.uid));
        const tripsSnapshot = await getDocs(tripsQuery);
        const tripsCount = tripsSnapshot.size;

        // Fetch blog posts count
        const blogPostsRef = collection(db, "blog_posts");
        const blogPostsQuery = query(blogPostsRef, where("authorUid", "==", user.uid));
        const blogPostsSnapshot = await getDocs(blogPostsQuery);
        const blogPostsCount = blogPostsSnapshot.size;

        setStats({
          trips: tripsCount,
          blogPosts: blogPostsCount,
          loading: false
        });
      } catch (error) {
        console.error("Error fetching stats:", error);
        setStats({
          trips: 0,
          blogPosts: 0,
          loading: false
        });
      }
    };

    fetchStats();
  }, [user?.uid, modal]);

  const handleFileUpload = () => {
    fileRef.current.click();
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setModal(false);
      toast.success("Logged out successfully!");
    } catch (error) {
      toast.error("Logout error: " + error.message);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size should be less than 5MB");
        return;
      }

      // Validate file type
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file");
        return;
      }

      const formData = new FormData();
      formData.append("file", file);

      try {
        setIsUploadingImage(true);
        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!res.ok) {
          throw new Error("Upload failed");
        }

        const data = await res.json();

        // Use context function to update profile picture
        await updateProfilePicture(data.url);

        toast.success("Profile picture updated!");
      } catch (err) {
        console.error("Upload error:", err);
        toast.error("Upload failed. Please try again.");
      } finally {
        setIsUploadingImage(false);
        // Reset file input
        if (fileRef.current) {
          fileRef.current.value = "";
        }
      }
    }
  };

  const handleSavePrefs = async () => {
    // Validate at least one preference
    if (prefs.length === 0) {
      toast.error("Please select at least one preference");
      return;
    }

    setSavingPrefs(true);
    try {
      // Use context function to update preferences
      await updatePreferences(prefs);
      toast.success("Preferences updated!");
      setEditPrefs(false);
    } catch (err) {
      console.error("Error updating preferences:", err);
      toast.error("Failed to update preferences");
    } finally {
      setSavingPrefs(false);
    }
  };

  const handleRemovePref = (prefToRemove) => {
    setPrefs((prev) => prev.filter((p) => p !== prefToRemove));
  };

  const handleTogglePref = (pref) => {
    setPrefs((prev) =>
      prev.includes(pref) ? prev.filter((p) => p !== pref) : [...prev, pref]
    );
  };

  return (
    <Dialog open={modal} onOpenChange={setModal}>
      <DialogContent className="sm:max-w-[500px] h-[80vh] overflow-y-auto p-0 scrollbar-gradient">
        {/* Header with Gradient Background */}
        <div className="relative h-24 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600" />

        {/* Avatar Section - Overlapping Header */}
        <div className="relative px-6 -mt-16">
          <div className="relative inline-block">
            <Avatar className="relative w-28 h-28  ring-4 ring-white dark:ring-gray-900 shadow-xl">
              <AvatarImage
                src={profile?.avatarUrl}
                alt={profile?.name}
                className="object-cover"
              />
              <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>

            {/* Camera Icon for Profile Picture Upload */}
            <button
              onClick={handleFileUpload}
              disabled={isUploadingImage}
              className="absolute bottom-0 right-0 w-9 h-9 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed rounded-full flex items-center justify-center shadow-lg border-2 border-white dark:border-gray-900 transition-colors"
            >
              <input
                type="file"
                accept="image/*"
                className="hidden"
                ref={fileRef}
                onChange={handleFileChange}
                disabled={isUploadingImage}
              />

              {isUploadingImage ? (
                <Loader2 className="w-4 h-4 text-white animate-spin" />
              ) : (
                <Camera className="w-4 h-4 text-white" />
              )}
            </button>
          </div>

          {/* User Info */}
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
              {profile?.name}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1.5 mt-1">
              <Mail className="w-4 h-4" />
              {profile?.email}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 pb-6 space-y-6">
          {/* Preferences Section */}
          {(profile?.preferences?.length > 0 || editPrefs) && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="flex items-center gap-2">
                  <Heart className="w-4 h-4 text-pink-500" />
                  <span className="font-semibold">Travel Preferences</span>
                </Label>
                {!editPrefs && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setEditPrefs(true)}
                    className="h-8 text-blue-600 hover:text-blue-700"
                  >
                    <Edit2 className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                )}
              </div>

              {editPrefs ? (
                <div className="space-y-3">
                  {/* Current Preferences */}
                  {prefs.length > 0 && (
                    <div>
                      <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                        Current preferences (click × to remove):
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {prefs.map((pref) => (
                          <div
                            key={pref}
                            className={`px-3 py-1.5 rounded-full bg-gradient-to-r ${
                              preferenceColors[pref] ||
                              "from-gray-500 to-gray-600"
                            } text-white text-sm font-medium shadow-sm flex items-center gap-1.5`}
                          >
                            {pref}
                            <button
                              onClick={() => handleRemovePref(pref)}
                              className="hover:bg-white/20 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Available Preferences */}
                  <div>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                      {prefs.length > 0 ? "Add more preferences:" : "Select preferences:"}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {Object.keys(preferenceColors)
                        .filter((pref) => !prefs.includes(pref))
                        .map((pref) => (
                          <button
                            key={pref}
                            type="button"
                            onClick={() => handleTogglePref(pref)}
                            className="px-3 py-1.5 rounded-full text-sm font-medium bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                          >
                            + {pref}
                          </button>
                        ))}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <Button
                      onClick={handleSavePrefs}
                      disabled={savingPrefs}
                      className="flex-1"
                      size="sm"
                    >
                      {savingPrefs ? (
                        <>
                          <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        "Save Changes"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setEditPrefs(false);
                        setPrefs(profile?.preferences || []);
                      }}
                      size="sm"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {profile?.preferences?.map((pref) => (
                    <div
                      key={pref}
                      className={`px-4 py-2 rounded-full bg-gradient-to-r ${
                        preferenceColors[pref] || "from-gray-500 to-gray-600"
                      } text-white text-sm font-medium shadow-md`}
                    >
                      {pref}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Account Details */}
          <div className="space-y-4">
            <div className="grid gap-3">
              <Label htmlFor="name-display" className="flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Display Name
              </Label>
              <Input
                id="name-display"
                value={profile?.name || ""}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>

            <div className="grid gap-3">
              <Label
                htmlFor="email-display"
                className="flex items-center gap-2"
              >
                <Mail className="w-4 h-4 text-blue-600" />
                Email Address
              </Label>
              <Input
                id="email-display"
                value={profile?.email || ""}
                readOnly
                className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
              />
            </div>

            {profile?.createdAt && (
              <div className="grid gap-3">
                <Label className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  Member Since
                </Label>
                <Input
                  value={formatDate(profile?.createdAt)}
                  readOnly
                  className="bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
                />
              </div>
            )}
          </div>

          {/* Stats Card */}
          <div className="grid grid-cols-2 gap-3 p-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 rounded-xl">
            {[
              { label: "Trips", value: stats.trips, icon: "✈️", loading: stats.loading },
              { label: "Blog Posts", value: stats.blogPosts, icon: "📝", loading: stats.loading },
            ].map((stat) => (
              <div
                key={stat.label}
                className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <div className="text-2xl mb-1">{stat.icon}</div>
                <div className="text-lg font-bold text-gray-900 dark:text-white">
                  {stat.loading ? (
                    <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-xs text-gray-600 dark:text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="px-6 py-2 flex-col sm:flex-row gap-2 bg-gray-50 dark:bg-gray-900/50 border-t dark:border-gray-800">
          <DialogClose asChild>
            <Button variant="outline" className="w-full sm:w-auto">
              Close
            </Button>
          </DialogClose>
          <Button
            variant="destructive"
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700"
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileCard;