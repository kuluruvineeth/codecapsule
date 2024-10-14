import { AuthViewType } from "@/lib/auth";
import { SupabaseClient } from "@supabase/supabase-js";
import { Dialog, DialogContent, DialogTitle } from "./ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import AuthForm from "./auth-form";

export function AuthDialog({
  open,
  setOpen,
  supabase,
  view,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  supabase: SupabaseClient;
  view: AuthViewType;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <VisuallyHidden>
          <DialogTitle>Sign in to CodeCapsule</DialogTitle>
        </VisuallyHidden>
        <AuthForm supabase={supabase} view={view} />
      </DialogContent>
    </Dialog>
  );
}
