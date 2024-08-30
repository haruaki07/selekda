import styles from "./section.module.css";

const Section = ({ children }) => {
  return <div className={styles.section}>{children}</div>;
};

const Title = ({ children }) => {
  return <h2 className={styles.section__title}>{children}</h2>;
};

const Description = ({ children }) => {
  return <p className={styles.section__description}>{children}</p>;
};

Section.Title = Title;
Section.Description = Description;

export { Section };
