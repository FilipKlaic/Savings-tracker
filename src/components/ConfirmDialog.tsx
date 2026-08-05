import { Modal } from "./Modal";
import { useTranslation } from "../lib/i18n";
import {
  dangerButtonClass,
  dangerButtonStyle,
  secondaryButtonClass,
} from "./formStyles";

interface ConfirmDialogProps {
  title: string;
  message: string;
  confirmLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  title,
  message,
  confirmLabel,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const { t } = useTranslation();
  return (
    <Modal title={title} onClose={onCancel}>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">{message}</p>
      <div className="mt-6 flex justify-end gap-2">
        <button className={secondaryButtonClass} onClick={onCancel}>
          {t("common.cancel")}
        </button>
        <button
          className={dangerButtonClass}
          style={dangerButtonStyle}
          onClick={onConfirm}
        >
          {confirmLabel ?? t("common.delete")}
        </button>
      </div>
    </Modal>
  );
}
