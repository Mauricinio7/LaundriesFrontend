import { NavLink } from "react-router-dom";
import type { ComponentProps } from "react";
import styles from "./styles/PillLink.module.css";

type PillLinkProps = ComponentProps<typeof NavLink> & {
  isActive?: boolean;
};

export const PillLink = ({ isActive, className, ...props }: PillLinkProps) => {
  return (
    <NavLink
      {...props}
      className={[
        styles.pill,
        isActive ? styles.pillActive : "",
        className ?? "",
      ]
        .join(" ")
        .trim()}
    />
  );
};

export default PillLink;
