import classNames from "classnames/bind";
import styles from "./UserPage.module.scss";
import CustomerTable from "@/Component/Customer/TableCustomer/CustomerTable";

const cx = classNames.bind(styles);
export const metadata = {
  title: "Customer",
  description: "Quản lý khách hàng",
};
export default function UserPage() {
  return (
    <>
      <div className={cx("wrapper")}>
        <h1 className={cx("wrapper__title")}>Danh sách khách hàng</h1>
      </div>
      <CustomerTable />
    </>
  );
}
