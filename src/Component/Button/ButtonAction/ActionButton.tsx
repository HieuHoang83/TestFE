import React, { useState } from "react";
import classNames from "classnames/bind";
import styles from "./ActionButton.module.scss";

const cx = classNames.bind(styles);

interface ActionButtonProps {
  text: string;
  color: string;
  onClick: () => void;
}

export const ActionButton: React.FC<ActionButtonProps> = ({
  text,
  color,
  onClick,
}) => {
  const [isHover, setIsHover] = useState(false);

  return (
    <button
      onClick={onClick}
      className={cx("buttonAction", { hover: isHover })}
      style={{ backgroundColor: color }}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
    >
      {text}
    </button>
  );
};
