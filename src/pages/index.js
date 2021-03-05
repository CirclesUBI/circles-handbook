import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import React from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './styles.module.css';

function Home() {
  return (
    <Layout>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">Circles Handbook</h1>
          <p className="hero__subtitle">Official Circles UBI documentation</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--secondary button--lg',
                styles.buttonReadIntroduction,
              )}
              to={useBaseUrl('docs/users')}
            >
              Read foreword
            </Link>
          </div>
        </div>
      </header>
      <main />
    </Layout>
  );
}

export default Home;
