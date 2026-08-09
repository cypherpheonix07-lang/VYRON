import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TypedConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  confirmWord,
  confirmLabel = "Confirm",
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  confirmWord: string;
  confirmLabel?: string;
  onConfirm: () => void;
}) {
  const [value, setValue] = useState("");
  const matched = value.trim() === confirmWord;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (!next) setValue("");
        onOpenChange(next);
      }}
    >
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[var(--critical)]">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="typed-confirm">
            Type <span className="font-mono text-foreground">{confirmWord}</span> to confirm
          </Label>
          <Input
            id="typed-confirm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            autoComplete="off"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={!matched}
            onClick={() => {
              onConfirm();
              setValue("");
              onOpenChange(false);
            }}
          >
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
