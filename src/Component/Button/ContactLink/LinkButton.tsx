import Link from "next/link";
import React, { useState } from "react";
import styles from "./ContactLink.module.scss";
import classNames from "classnames/bind";

const cx = classNames.bind(styles);
const ContactLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => {
  const [hover, setHover] = useState(false);

  return (
    <Link
      href={href}
      passHref
      className={cx("contactLink", { hover })}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </Link>
  );
};

export default ContactLink;
