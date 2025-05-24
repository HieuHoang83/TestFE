"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Table, message, Pagination, Spin, Modal, Form } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Contact } from "@/interface/InterfaceContact";

import classNames from "classnames/bind";
import styles from "./ContactTable.module.scss";
import { ActionButton } from "@/Component/Button/ButtonAction/ActionButton";
import ContactForm from "../ContactForm/ContactForm";

const cx = classNames.bind(styles);

const fetcher = (url: string) => fetch(url).then((res) => res.json());

const LoadingTab = () => (
  <div className={cx("loadingWrapper")}>
    <Spin spinning size="large" />
  </div>
);

interface ContactTableProps {
  customerId: string;
}

export default function ContactTable({ customerId }: ContactTableProps) {
  const [form] = Form.useForm();
  const [modalMode, setModalMode] = useState<"create" | "update" | null>(null);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Build API URL theo customerId và currentPage
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;
  const apiUrl = `${baseUrl}/contact/customer/${customerId}?page=${currentPage}&limit=6`;

  // Sử dụng SWR với refreshInterval 10s, không tự revalidate khi focus
  const { data, error, isValidating, mutate } = useSWR<{
    statusCode: number;
    message?: string;
    data: {
      contacts: Contact[];
      currentPage: number;
      totalItems: number;
    };
  }>(apiUrl, fetcher, {
    refreshInterval: 10000,
    revalidateOnFocus: false,
    dedupingInterval: 5000,
  });

  const loading = !data && !error;

  // Xử lý delete
  const handleDelete = async (id: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      const res = await fetch(`${baseUrl}/contact/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Xóa thất bại");
      message.success("Xóa liên hệ thành công");
      mutate(); // gọi revalidate lại dữ liệu sau khi xóa
    } catch (error: any) {
      message.error(error.message);
    }
  };

  // Xử lý submit form (create/update)
  const handleSubmit = async (values: Contact) => {
    const isUpdate = modalMode === "update";
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const url = isUpdate
      ? `${baseUrl}/contact/${selectedContact?.id}`
      : `${baseUrl}/contact`;

    const method = isUpdate ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = await res.json();

      if (res.ok) {
        message.success(
          isUpdate ? "Cập nhật thành công" : "Thêm liên hệ thành công"
        );
        setModalMode(null);
        setSelectedContact(null);
        mutate(); // revalidate lại dữ liệu sau khi tạo hoặc cập nhật
      } else {
        message.error(result.message || "Thao tác thất bại");
      }
    } catch {
      message.error("Đã có lỗi xảy ra");
    }
  };

  // Cột cho bảng
  const sharedHeaderCellProps = { className: cx("headerCell") };
  const sharedCellProps = { className: cx("cell") };

  const columns: ColumnsType<Contact> = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      className: cx("col-name"),
      onHeaderCell: () => sharedHeaderCellProps,
      onCell: () => sharedCellProps,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      className: cx("col-email"),
      onHeaderCell: () => sharedHeaderCellProps,
      onCell: () => sharedCellProps,
    },
    {
      title: "Chức vụ",
      dataIndex: "position",
      key: "position",
      className: cx("col-position"),
      onHeaderCell: () => sharedHeaderCellProps,
      onCell: () => sharedCellProps,
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
      key: "note",
      className: cx("col-note"),
      onHeaderCell: () => sharedHeaderCellProps,
      onCell: () => sharedCellProps,
    },
    {
      title: "Hành động",
      key: "action",
      className: cx("col-action"),
      render: (_, record) => (
        <div className={cx("actionButtons")}>
          <ActionButton
            text="Chỉnh sửa"
            color="#52c41a"
            onClick={() => {
              setSelectedContact(record);
              form.setFieldsValue(record);
              setModalMode("update");
            }}
          />
          <ActionButton
            text="Xóa"
            color="#ff4d4f"
            onClick={() =>
              Modal.confirm({
                title: "Xác nhận xóa",
                content: "Bạn có chắc chắn muốn xóa liên hệ này?",
                okText: "Xóa",
                cancelText: "Hủy",
                centered: true,
                onOk: () => handleDelete(record.id),
              })
            }
          />
        </div>
      ),
      onHeaderCell: () => sharedHeaderCellProps,
      onCell: () => sharedCellProps,
    },
  ];

  return (
    <div className={cx("wrapper")}>
      {loading || isValidating ? (
        <LoadingTab />
      ) : (
        <div className={cx("tableContainer")}>
          <div className={cx("searchWrapper")}>
            <button
              className={cx("btnAddContact")}
              onClick={() => setModalMode("create")}
            >
              Thêm liên hệ
            </button>
          </div>

          <Table
            className={cx("table")}
            columns={columns}
            dataSource={data?.data.contacts || []}
            rowKey="id"
            pagination={false}
            scroll={{ x: "max-content" }}
          />

          <div className={cx("paginationWrapper")}>
            <Pagination
              current={currentPage}
              pageSize={6}
              total={data?.data.totalItems || 0}
              showSizeChanger={false}
              onChange={(page) => setCurrentPage(page)}
            />
          </div>
        </div>
      )}

      <ContactForm
        visible={modalMode !== null}
        customerId={customerId}
        onCancel={() => {
          setModalMode(null);
          setSelectedContact(null);
        }}
        onSubmit={handleSubmit}
        initialValues={selectedContact}
      />
    </div>
  );
}
