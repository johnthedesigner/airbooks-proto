import styles from "./CardHeader.module.css";

interface headerProps {
  label: string;
}

const CardHeader = ({ label }: headerProps) => {
  return <div className={styles["card-header"]}>{label}</div>;
};

export default CardHeader;
