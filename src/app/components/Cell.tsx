import styles from "./Cell.module.css";

interface cellProps {
  children: any;
}

const Cell = ({ children }: cellProps) => {
  return <div className={styles.cell}>{children}</div>;
};

export default Cell;
