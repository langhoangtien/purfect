import { useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { API_URL } from "@/config-global";

const userSchema = z.object({
  username: z.string().min(3, "Username must be at least 3 characters"),
  fullName: z.string().min(3, "Full name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
});

type UserFormData = z.infer<typeof userSchema> & { _id?: string };

interface UserFormDialogProps {
  open: boolean;
  onClose: () => void;
  user?: UserFormData | null;
  onSuccess: () => void;
}

export default function UserFormDialog({
  open,
  onClose,
  user,
  onSuccess,
}: UserFormDialogProps) {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<UserFormData>({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (user) {
      setValue("username", user.username);
      setValue("fullName", user.fullName);
      setValue("email", user.email);
    } else {
      reset();
    }
  }, [user, setValue, reset]);

  const onSubmit = async (data: UserFormData) => {
    try {
      const token = sessionStorage.getItem("token");
      if (!token) throw new Error("Unauthorized: No token found");

      const res = await fetch(`${API_URL}/users${user ? `/${user._id}` : ""}`, {
        method: user ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save user");

      toast.success(`User ${user ? "updated" : "created"} successfully`);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message);
      else toast.error("An error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="min-w-[400px] min-h-[500px]">
        <DialogTitle>{user ? "Edit User" : "Add User"}</DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input placeholder="Username" {...register("username")} />
          {errors.username && (
            <p className="text-red-500">{errors.username.message}</p>
          )}

          <Input placeholder="Full Name" {...register("fullName")} />
          {errors.fullName && (
            <p className="text-red-500">{errors.fullName.message}</p>
          )}

          <Input placeholder="Email" {...register("email")} />
          {errors.email && (
            <p className="text-red-500">{errors.email.message}</p>
          )}

          {!user && (
            <>
              <Input
                type="password"
                placeholder="Password"
                {...register("password")}
              />
              {errors.password && (
                <p className="text-red-500">{errors.password.message}</p>
              )}
            </>
          )}
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">{user ? "Update" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
