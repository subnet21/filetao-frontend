import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import Navbar from "@/components/common/Navbar";
import { useAuth } from "@/context/AuthContext"; // Adjust the path as needed
import { useToast } from "@/components/ui/use-toast";

export default function MyAccount() {
  const { currentUser, resetPassword, deleteUser, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false); // State for the dialog
  const { toast } = useToast();

  useEffect(() => {
    if (currentUser) {
      setUserData(currentUser);
      setLoading(false);
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const handleResetPassword = async () => {
    if (!userData || !userData.email) return;
    try {
      await resetPassword(userData.email);
      toast({
        description: "Password reset email sent successfully.",
      });
      logout();
    } catch (error) {
      console.error("Error resetting password:", error);
      toast({
        description: "Failed to reset password. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteAccount = async () => {
    setIsDialogOpen(true); // Open the dialog for confirmation
  };

  const confirmDeleteAccount = async () => {
    setIsDialogOpen(false); // Close the dialog
    try {
      await deleteUser();
      toast({
        description: "Account deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting account:", error);
      toast({
        description: "Failed to delete account. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData) {
    return <div>No user data found</div>;
  }

  return (
    <>
      <Navbar />
      <div className="flex items-center justify-center h-screen">
        <div className="w-full max-w-3xl mx-auto px-4 py-8 md:px-6 md:py-12">
          <div className="grid gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Account Settings</CardTitle>
              </CardHeader>
              <Separator />
              <CardHeader className="grid gap-4 text-left">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-medium text-base">
                      Delete Account
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                      Permanently delete your account and all your data.
                    </CardDescription>
                  </div>
                  <div className="min-w-[120px]">
                    <AlertDialog
                      isOpen={isDialogOpen}
                      onDismiss={() => setIsDialogOpen(false)}
                    >
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={handleDeleteAccount}
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. Are you sure you want
                            to delete your account?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel
                            onClick={() => setIsDialogOpen(false)}
                          >
                            Cancel
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={confirmDeleteAccount}
                            variant="destructive"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-medium text-base">
                      Reset Password
                    </CardTitle>
                    <CardDescription className="text-sm text-gray-500 dark:text-gray-400">
                      Change your account password.
                    </CardDescription>
                  </div>
                  <div className="min-w-[120px]">
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={handleResetPassword}
                    >
                      Reset
                    </Button>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
