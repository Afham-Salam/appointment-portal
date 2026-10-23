"use client";

import { ConfigProvider, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";

const themeConfig = {
  token: {
    colorPrimary: "#2D5A3F",
    colorText: "#1a1c1a",
    colorTextHeading: "#144229",
    borderRadius: 6,
    fontFamily: "var(--font-manrope), system-ui, sans-serif",
  },
};

type DeleteConfirmationModalProps = {
  open: boolean;
  itemName?: string;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  actionText?: string;
  actionDescription?: string;
};

export default function DeleteConfirmationModal({
  open,
  itemName = "this appointment",
  onCancel,
  onConfirm,
  title = "Delete appointment?",
  actionText = "Delete",
  actionDescription = "This action cannot be undone.",
}: DeleteConfirmationModalProps) {
  return (
    <ConfigProvider theme={themeConfig}>
      <Modal
        open={open}
        title={
          <span className="flex items-center gap-2 text-lg font-semibold text-[#144229]">
            <ExclamationCircleOutlined className="text-[#c9252d]!" />
            {title}
          </span>
        }
        onCancel={onCancel}
        onOk={onConfirm}
        okText={actionText}
        cancelText="Cancel"
        okButtonProps={{
          danger: true,
          className: "h-11! bg-[#c9252d]! font-semibold! text-white! hover:bg-[#a91f26]!",
        }}
        cancelButtonProps={{
          className: "h-11! border-[#c1c9c0]! text-[#414942]! hover:border-[#2D5A3F]! hover:text-[#2D5A3F]!",
        }}
        centered
      >
        <p className="mb-1 text-[#414942]">
          Are you sure you want to continue with <strong>{itemName}</strong>?
        </p>
        <p className="m-0 text-sm text-[#69746d]">{actionDescription}</p>
      </Modal>
    </ConfigProvider>
  );
}
