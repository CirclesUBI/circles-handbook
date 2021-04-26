import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import PropTypes from 'prop-types';
import React from 'react';
import clsx from 'clsx';
import useBaseUrl from '@docusaurus/useBaseUrl';

import styles from './styles.module.css';

const DocumentationLink = ({ imageUrl, title, children }) => {
  const imgUrl = useBaseUrl(imageUrl);

  return (
    <div className={styles.documentationLinksItem}>
      <img
        alt={title}
        className={styles.documentationLinksImage}
        src={imgUrl}
      />
      <h3 className={styles.documentationLinksTitle}>{title}</h3>
      <p className={styles.documentationLinksContent}>{children}</p>
    </div>
  );
};

DocumentationLink.propTypes = {
  children: PropTypes.node.isRequired,
  imageUrl: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};

const Home = () => {
  return (
    <Layout>
      <header className={clsx('hero hero--primary', styles.heroBanner)}>
        <div className="container">
          <h1 className="hero__title">Circles Handbook</h1>
          <p className="hero__subtitle">Official Circles UBI documentation</p>
          <div className={styles.buttons}>
            <Link
              className={clsx(
                'button button--outline button--lg',
                styles.buttonReadIntroduction,
              )}
              to={useBaseUrl('docs/users')}
            >
              Read foreword
            </Link>
          </div>
        </div>
      </header>
      <main>
        <p className={styles.introduction}>
          <strong>Welcome!</strong> 🌱
        </p>
        <p className={styles.introduction}>
          This is the official documentation of{' '}
          <a href="https://joincircles.net" rel="noreferrer" target="_blank">
            Circles UBI
          </a>
          , a basic income made to promote local economy within your community.
        </p>
        <section className={styles.documentationLinks}>
          <div className="container">
            <div className="row">
              <a className="col col--4" href="docs/users">
                <DocumentationLink
                  imageUrl="images/users.svg"
                  title="For users"
                >
                  Learn more about Circles and its economy
                </DocumentationLink>
              </a>
              <a className="col col--4" href="docs/communities">
                <DocumentationLink
                  imageUrl="images/communities.svg"
                  title="For communities"
                >
                  Start a Circles Hub for your local community
                </DocumentationLink>
              </a>
              <a className="col col--4" href="docs/developers">
                <DocumentationLink
                  imageUrl="images/developers.svg"
                  title="For developers"
                >
                  Read how to contribute to the Circles codebase
                </DocumentationLink>
              </a>
            </div>
          </div>
        </section>
        <p className={styles.introduction}>
          The handbook is for <a href="/docs/users/">users</a> who want to learn more about Circles, for <a href="/docs/communities">communities</a> who want to set up their own alternative money system and for <a href="/docs/developers">developers</a> who want to contribute to the Circles codebase and understand how it works.
        </p>
        <p className={styles.introduction}>
          Circles is an Open Source project and the community adds constantly new content to the handbook. If you have any ideas or changes to suggest, check out the <a href="https://github.com/CirclesUBI/.github/blob/main/CONTRIBUTING.md" rel="noreferrer" target="_blank">contribution guidelines</a>, visit our <a href="https://chat.joincircles.net" rel="noreferrer" target="_blank">chat</a> or <a href="https://aboutcircles.com" rel="noreferrer" target="_blank">forum</a>or <a href="https://github.com/CirclesUBI/circles-handbook" rel="noreferrer" target="_blank">edit</a> the handbook.
        </p>
        <p className={styles.introduction}>🌿</p>
      </main>
    </Layout>
  );
};

export default Home;
