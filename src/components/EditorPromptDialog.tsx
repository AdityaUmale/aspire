"use client";

import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type EditorPromptDialogProps = {
  open: boolean;
  title: string;
  description?: string;
  label?: string;
  placeholder?: string;
  initialValue?: string;
  confirmLabel?: string;
  allowEmpty?: boolean;
  onConfirm: (value: string) => void;
  onCancel: () => void;
};

export default function EditorPromptDialog({
  open,
  title,
  description,
  label = "Value",
  placeholder,
  initialValue = "",
  confirmLabel = "Apply",
  allowEmpty = false,
  onConfirm,
  onCancel,
}: EditorPromptDialogProps) {
  const [value, setValue] = useState(initialValue);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setValue(initialValue);
      const timer = window.setTimeout(() => inputRef.current?.focus(), 30);
      return () => window.clearTimeout(timer);
    }
  }, [open, initialValue]);

  useEffect(() => {
    if (!open) {
      return;
    }

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onCancel();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!open) {
    return null;
  }

  const submit = () => {
    const trimmed = value.trim();
    if (!allowEmpty && !trimmed) {
      return;
    }
    onConfirm(trimmed);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
        aria-label="Close dialog"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="editor-prompt-title"
        className="relative w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-2xl"
      >
        <h3
          id="editor-prompt-title"
          className="text-base font-semibold text-gray-900"
        >
          {title}
        </h3>
        {description ? (
          <p className="mt-1 text-sm text-gray-500">{description}</p>
        ) : null}
        <div className="mt-4 space-y-2">
          <Label htmlFor="editor-prompt-input" className="text-xs text-gray-600">
            {label}
          </Label>
          <Input
            ref={inputRef}
            id="editor-prompt-input"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={placeholder}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                submit();
              }
            }}
            className="rounded-xl"
          />
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="rounded-full"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={submit}
            className="rounded-full bg-[#1a237e] hover:bg-[#0d1642] text-white"
          >
            {confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
}
