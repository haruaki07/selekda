import { useEffect } from "react";
import { Container } from "../Container";
import styles from "./banner.module.css";
import { useState } from "react";
import { useRef } from "react";

export const Banner = () => {
  let bannerRef = useRef();
  let [show, setShow] = useState(false);

  useEffect(() => {
    if (bannerRef.current) {
      const bannerObs = new IntersectionObserver(callBackFunction);
      function callBackFunction(entries) {
        const [entry] = entries;
        setShow(entry.isIntersecting);
      }

      bannerObs.observe(bannerRef.current);

      return () => bannerObs.unobserve(bannerRef.current);
    }
  }, []);

  return (
    <div className={`${styles.banner} ${show ? "show" : ""}`} ref={bannerRef}>
      <div
        className={styles.banner__bg}
        style={{ "--bg-url": "url('/assets/banner.jpg')" }}
      />
      <div className={styles.banner__overlay} />
      <Container>
        <div className={styles.banner__text}>
          <h3 className={styles["banner__text-title"]}>
            Empowering AI in Manufacturing Industry
          </h3>
          <p className={styles["banner__text-description"]}>
            Unlock the potential of innovation with AI-driven solutions that
            enhance efficiency, optimize production processes, and drive
            sustainable growth.
          </p>
        </div>
      </Container>
    </div>
  );
};
