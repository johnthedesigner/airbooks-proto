import styles from "./Row.module.css";

interface rowProps {
  children: any;
  fr?: number;
  maxHeight?: string;
  minHeight?: string;
}

const Row = ({ children, fr = 1, maxHeight, minHeight }: rowProps) => {
  const rowStyles = {
    flex: fr,
    maxHeight: maxHeight ? maxHeight : "auto",
    minHeight: minHeight ? minHeight : "auto",
  };

  return (
    <div className={styles.row} style={rowStyles}>
      {children}
    </div>
  );
};

export default Row;
