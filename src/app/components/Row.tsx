import styles from "./Row.module.css";

interface rowProps {
  children: any;
  fr?: number;
  maxHeight?: string;
}

const Row = ({ children, fr = 1, maxHeight }: rowProps) => {
  const rowStyles = {
    flex: fr,
    maxHeight: maxHeight ? maxHeight : "auto",
  };

  return (
    <div className={styles.row} style={rowStyles}>
      {children}
    </div>
  );
};

export default Row;
