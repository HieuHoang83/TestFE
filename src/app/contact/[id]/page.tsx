import { base64UrlDecode } from "@/Base64/Decode";
import styles from "./ContactUserPage.module.scss";
import classNames from "classnames/bind";
import ContactTable from "@/Component/Contact/TableContact/ContactTable";

const cx = classNames.bind(styles);
interface ContactPageProps {
  params: { id: string };
}
export const metadata = {
  title: "Contact",
  description: "Quản lý liên lạc của khách hàng",
};
export default function ContactPage({ params }: ContactPageProps) {
  const decoded = base64UrlDecode(params.id);
  const [id, name] = decoded.split(":");
  return (
    <>
      <div className={cx("wrapper")}>
        <h1 className={cx("wrapper__title")}>
          Danh sách liên hệ
          <br />
          <strong className={cx("highlightedName")}>{name}</strong>
        </h1>
      </div>
      <ContactTable customerId={id} />
    </>
  );
}
