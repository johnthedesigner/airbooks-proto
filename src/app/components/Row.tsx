import styles from "./Row.module.css";

interface rowProps {
  children: any;
  fr?: number;
}

const Row = ({ children, fr = 1 }: rowProps) => {
  const rowStyles = {
    flex: fr,
  };

  return (
    <div className={styles.row} style={rowStyles}>
      {children}
    </div>
  );
};

export default Row;
