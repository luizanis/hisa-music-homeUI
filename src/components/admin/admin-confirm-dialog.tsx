import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";

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
} from "@/components/ui/alert-dialog";

type AdminConfirmDialogProps = {
  trigger: ReactNode;
  title: string;
  description: string;
  confirmLabel: string;
  onConfirm: () => void;
};

export const AdminConfirmDialog = ({
  trigger,
  title,
  description,
  confirmLabel,
  onConfirm,
}: AdminConfirmDialogProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="max-w-md gap-0 border-wire-rule bg-background p-0 sm:rounded-[var(--radius)]">
        <AlertDialogHeader className="border-b border-wire-rule p-5 text-left">
          <AlertDialogTitle className="text-[14px] uppercase tracking-[0.1em] text-foreground">
            {title}
          </AlertDialogTitle>
          <AlertDialogDescription className="text-[12px] leading-relaxed text-wire-ink-soft">
            {description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row items-center justify-end gap-2 p-4">
          <AlertDialogCancel className="mt-0 h-9 rounded-[var(--radius)] border-wire-rule text-[10px] uppercase tracking-[0.14em]">
            {t("admin.common.cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
            className="h-9 rounded-[var(--radius)] bg-primary px-4 text-[10px] uppercase tracking-[0.14em] text-primary-foreground hover:bg-primary/85"
          >
            {confirmLabel}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
