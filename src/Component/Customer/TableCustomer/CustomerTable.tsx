"use client";

import React, { useState } from "react";
import useSWR from "swr";
import { Table, message, Pagination, Spin, Modal, Form, Input } from "antd";
import type { ColumnsType } from "antd/es/table";
import { Customer } from "@/interface/InterfaceCustomer";
import { GetCustomerResponse } from "@/interface/InterfaceGetApiResponse";
import { ActionButton } from "../../Button/ButtonAction/ActionButton";
import UserUpdateForm from "../Userform/UserForm";
import ContactLink from "../../Button/ContactLink/LinkButton";
import classNames from "classnames/bind";
import styles from "./CustomerTable.module.scss";
import { base64UrlEncode } from "@/Base64/Encode";

const cx = classNames.bind(styles);

const fetcher = async (url: string) => {
  const res = await fetch(url);
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Fetch error");
  }
  return res.json();
};

export default function CustomerTable() {
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalMode, setModalMode] = useState<"create" | "update" | null>(null);
  const [selectedUser, setSelectedUser] = useState<Customer | null>(null);

  // Build API URL dynamically depending on search & page
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  const apiUrl = searchText
    ? `${baseUrl}/user/search?query=${encodeURIComponent(
        searchText
      )}&page=${currentPage}&limit=6`
    : `${baseUrl}/user?page=${currentPage}&limit=6`;

  const { data, error, isValidating, mutate } = useSWR<GetCustomerResponse>(
    apiUrl,
    fetcher,
    {
      revalidateOnFocus: true, // Không tự động fetch lại khi tab focus
      refreshInterval: 10000, // Tự động fetch lại mỗi 10 giây
      dedupingInterval: 5000, // Nếu gọi API cùng url trong vòng 5 giây thì dùng cache, không gọi lại
    }
  );

  const loading = !data && !error;

  const customers = data?.data.customers || [];
  const totalItems = data?.data.totalItems || 0;
  const currentApiPage = data?.data.currentPage || 1;

  // Handle delete action, then revalidate data
  const handleDelete = async (id: string) => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;

      const res = await fetch(`${baseUrl}/user/${id}`, {
        method: "DELETE",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message || "Xóa thất bại");
      message.success("Xóa thành công!");
      mutate(); // revalidate data after delete
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Handle create or update user
  const handleUserSubmit = async (values: Customer) => {
    const isUpdate = modalMode === "update";
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;

    const url = isUpdate
      ? `${baseUrl}/user/${selectedUser?.id}`
      : `${baseUrl}/user`;
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
          isUpdate ? "Cập nhật thành công!" : "Tạo người dùng thành công!"
        );
        setModalMode(null);
        setSelectedUser(null);
        mutate(); // revalidate data after update/create
      } else {
        message.error(result.message || "Thao tác thất bại");
      }
    } catch {
      message.error("Đã có lỗi xảy ra");
    }
  };

  const renderActionButtons = (record: Customer) => (
    <div className={cx("actionButtons")}>
      <ActionButton
        text="Chỉnh sửa"
        color="#52c41a"
        onClick={() => {
          setSelectedUser(record);
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
            content: "Bạn có chắc chắn muốn xóa khách hàng này?",
            okText: "Xóa",
            cancelText: "Hủy",
            centered: true,
            onOk: () => handleDelete(record.id),
          })
        }
      />
    </div>
  );

  const sharedCellProps = { className: cx("cell") };
  const sharedHeaderCellProps = { className: cx("headerCell") };

  const columns: ColumnsType<Customer> = [
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
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
      className: cx("col-phone"),
      onHeaderCell: () => sharedHeaderCellProps,
      onCell: () => sharedCellProps,
    },
    {
      title: "Công ty",
      dataIndex: "company",
      key: "company",
      className: cx("col-company"),
      onHeaderCell: () => sharedHeaderCellProps,
      onCell: () => sharedCellProps,
    },
    {
      title: "Liên hệ",
      key: "contact",
      className: cx("col-contact"),
      render: (_, record) => (
        <ContactLink
          href={`/contact/${base64UrlEncode(`${record.id}:${record.name}`)}`}
        >
          Liên hệ
        </ContactLink>
      ),
      onHeaderCell: () => ({ className: cx("headerCellaction") }),
      onCell: () => ({ className: cx("centeredCell") }),
    },
    {
      title: "Hành động",
      key: "action",
      className: cx("col-action"),
      render: (_, record) => renderActionButtons(record),
      onHeaderCell: () => ({ className: cx("headerCellaction") }),
      onCell: () => sharedCellProps,
    },
  ];
  const LoadingTab = () => (
    <div className={cx("loadingWrapper")}>
      <Spin spinning size="large" />
    </div>
  );
  return (
    <div className={cx("wrapper")}>
      {loading || isValidating ? (
        <LoadingTab />
      ) : (
        <div className={cx("tableContainer")}>
          <div className={cx("searchWrapper")}>
            <button
              className={cx("btnAddCustom")}
              onClick={() => setModalMode("create")}
            >
              Thêm khách hàng
            </button>
            <Input.Search
              placeholder="Tìm kiếm theo tên, email..."
              allowClear
              enterButton="Tìm"
              size="middle"
              style={{ width: 300 }}
              onSearch={handleSearch}
            />
          </div>

          <Table
            className={cx("table")}
            columns={columns}
            dataSource={customers}
            rowKey="id"
            pagination={false}
            scroll={{ x: "max-content" }}
          />

          <div className={cx("paginationWrapper")}>
            <Pagination
              current={currentPage}
              pageSize={6}
              total={totalItems}
              showSizeChanger={false}
              onChange={handlePageChange}
            />
          </div>
        </div>
      )}

      <UserUpdateForm
        visible={modalMode !== null}
        user={modalMode === "update" ? selectedUser : undefined}
        onCancel={() => {
          setModalMode(null);
          setSelectedUser(null);
        }}
        onSubmit={handleUserSubmit}
      />
    </div>
  );
}
