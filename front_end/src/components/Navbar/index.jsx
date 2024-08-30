import { Container } from "../Container";
import styles from "./navbar.module.css";

export const Navbar = () => {
  return (
    <div className={styles.navbar}>
      <Container>
        <div className={styles.navbar__wrapper}>
          <a href="#" className={styles.navbar__brand}>
            <img
              src="/assets/logo.svg"
              alt="WebtechID"
              className={styles["navbar__brand-img"]}
            />
          </a>
          <div className={styles.navbar__links}>
            <a
              href="#"
              className={`${styles["navbar__link-item"]} ${styles["navbar__link-item--active"]}`}
            >
              Home
            </a>
            <a href="/game" className={styles["navbar__link-item"]}>
              Game
            </a>
            <a href="/dsgn" className={styles["navbar__link-item"]}>
              Design
            </a>
            <a href="#" className={styles["navbar__link-item"]}>
              Sign In
            </a>
          </div>
        </div>
      </Container>
    </div>
  );
};
