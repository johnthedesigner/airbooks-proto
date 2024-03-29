import styles from "./Column.module.css";

interface columnProps {
  children: any;
  fr?: number;
}

const Column = ({ children, fr = 1 }: columnProps) => {
  const columnStyles = {
    flex: fr,
  };

  return (
    <div className={styles.column} style={columnStyles}>
      {children}
    </div>
  );
};

export default Column;
