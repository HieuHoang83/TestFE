import React, { useEffect } from "react";
import { Modal, Form, Input, message } from "antd";
import { Customer } from "@/interface/InterfaceCustomer";

type UserFormProps = {
  visible: boolean;
  onCancel: () => void;
  user?: Customer | null; // nếu có => update, không có => tạo mới
  onSubmit: (values: Customer) => void;
};

const UserUpdateForm: React.FC<UserFormProps> = ({
  visible,
  onCancel,
  user,
  onSubmit,
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
      form.setFieldsValue(user);
    } else {
      form.resetFields();
    }
  }, [user, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      // Nếu đang update, merge với user hiện tại, còn tạo mới thì chỉ lấy values
      const submitValues: Customer = user
        ? { ...user, ...values }
        : (values as Customer);

      if (onSubmit) {
        await onSubmit(submitValues);
        form.resetFields();
      }
    } catch (error) {
      message.error(
        user ? "Có lỗi xảy ra khi cập nhật" : "Có lỗi xảy ra khi tạo mới"
      );
    }
  };

  return (
    <Modal
      open={visible}
      title={user ? "Cập nhật thông tin người dùng" : "Thêm người dùng mới"}
      onCancel={onCancel}
      onOk={handleSubmit}
      okText={user ? "Lưu" : "Tạo mới"}
      cancelText="Hủy"
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, type: "email", message: "Email không hợp lệ" },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Số điện thoại"
          name="phone"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="Công ty" name="company" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default UserUpdateForm;
