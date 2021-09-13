import React from 'react';
import styles from './styles.module.css';

import img from './img.png';

export const Remixer = ({ text }) => {
  return (
    <div className={styles.test}>
      Example Component: {text} <br />
      <img src={img} />
    </div>
  );
};
