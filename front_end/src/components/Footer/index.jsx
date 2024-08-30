import { Container } from "../Container";
import styles from "./footer.module.css";

export const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footer__top}>
        <Container>
          <div className={styles.footer__sections}>
            <div className={styles.footer__section}>
              <div className={styles["footer__section-title"]}>About Us</div>
              <div className={styles["footer__section-description"]}>
                WebtechID is a a go-to and one-stop information center, and an
                inclusive community for anyone interested in technological
                development.
              </div>
            </div>
            <div className={styles.footer__section}>
              <div className={styles["footer__section-title"]}>Navigations</div>
              <div
                className={`${styles["footer__section-description"]} ${styles["footer__section-navigation"]}`}
              >
                <ul className={styles["footer__section-list"]}>
                  <li>
                    <a href="#">Home</a>
                  </li>
                  <li>
                    <a href="#">Game</a>
                  </li>
                  <li>
                    <a href="#">Design</a>
                  </li>
                  <li>
                    <a href="#">Blog</a>
                  </li>
                  <li>
                    <a href="#">Services</a>
                  </li>
                  <li>
                    <a href="#">Testimonials</a>
                  </li>
                </ul>
                <ul className={styles["footer__section-list"]}>
                  <li>
                    <a href="#">Portfolios</a>
                  </li>
                  <li>
                    <a href="#">Career</a>
                  </li>
                </ul>
              </div>
            </div>
            <div className={styles.footer__section}>
              <div className={styles["footer__section-title"]}>Contacts</div>
              <div className={styles["footer__section-description"]}>
                <a href="#" className={styles["footer__section-contact-item"]}>
                  <img src="assets/twitter.png" alt="Twitter" />
                  @WebtechID
                </a>
                <a href="#" className={styles["footer__section-contact-item"]}>
                  <img src="assets/facebook.png" alt="Facebook" />
                  WebtechID
                </a>
                <a href="#" className={styles["footer__section-contact-item"]}>
                  <img src="assets/youtube.png" alt="Youtube" />
                  @webtechid
                </a>
              </div>
            </div>
            <div className={styles.footer__section}>
              <img
                src="assets/logo-small.svg"
                alt="WebtechID"
                className={styles["footer__section-logo"]}
              />
            </div>
          </div>
        </Container>
      </div>
      <div className={styles.footer__bottom}>
        2024 © WebtechID | Designed by Misbahul Khoiri
      </div>
    </div>
  );
};
