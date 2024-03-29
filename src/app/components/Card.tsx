import styles from "./Card.module.css";

interface cardProps {
  children: any;
}

const Card = ({ children }: cardProps) => {
  return <div className={styles.card}>{children}</div>;
};

export default Card;
