import { Contact } from "@/interface/InterfaceContact";
import { Form, Input, Modal } from "antd";
import { useEffect } from "react";

interface ContactFormProps {
  visible: boolean;
  customerId: string;
  onCancel: () => void;
  onSubmit: (values: Contact) => void;
  initialValues?: Contact | null;
}

export default function ContactForm({
  visible,
  customerId,
  onCancel,
  onSubmit,
  initialValues,
}: ContactFormProps) {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields(); // reset trước để tránh bị đè
      if (initialValues) {
        form.setFieldsValue(initialValues);
      }
    }
  }, [visible, initialValues, form]);

  const handleFinish = (values: Contact) => {
    const payload = { ...values, customerId };
    onSubmit(payload);
  };

  return (
    <Modal
      open={visible}
      onCancel={onCancel}
      onOk={() => form.submit()}
      title={initialValues ? "Chỉnh sửa liên hệ" : "Thêm liên hệ"}
      okText={initialValues ? "Cập nhật" : "Thêm"}
      cancelText="Hủy"
      destroyOnClose
      centered
    >
      <Form form={form} layout="vertical" onFinish={handleFinish}>
        <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item
          name="email"
          label="Email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item name="position" label="Chức vụ" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="note" label="Ghi chú">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
