module.exports = {
  title: 'Circles UBI | Handbook',
  tagline: 'Official Circles UBI documentation',
  url: 'https://handbook.joincircles.net',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'images/favicon.ico',
  organizationName: 'CirclesUBI',
  projectName: 'circles-handbook',
  themeConfig: {
    hideableSidebar: true,
    navbar: {
      title: 'Circles Handbook',
      logo: {
        alt: 'Circles UBI',
        src: 'images/logo.svg',
      },
      items: [
        {
          to: 'docs/users',
          activeBasePath: 'docs/users',
          label: 'Users',
          position: 'left',
        },
        {
          to: 'docs/communities',
          activeBasePath: 'docs/communities',
          label: 'Communities',
          position: 'left',
        },
        {
          to: 'docs/developers',
          activeBasePath: 'docs/developers',
          label: 'Developers',
          position: 'left',
        },
        {
          to: 'docs/developers/whitepaper',
          activeBasePath: 'docs/developers/whitepaper',
          label: 'Whitepaper',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Handbook',
          items: [
            {
              label: 'Users',
              to: 'docs/users',
            },
            {
              label: 'Communities',
              to: 'docs/communities',
            },
            {
              label: 'Developers',
              to: 'docs/developers',
            },
            {
              label: 'Whitepaper',
              to: 'docs/developers/whitepaper',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'Chat',
              href: 'https://chat.joincircles.net',
            },
            {
              label: 'Forum',
              href: 'https://aboutcircles.com',
            },
            {
              label: 'Twitter',
              href: 'https://twitter.com/CirclesUBI',
            },
            {
              label: 'GitHub',
              href: 'https://github.com/CirclesUBI',
            },
          ],
        },
        {
          title: 'Links',
          items: [
            {
              label: 'Website',
              href: 'https://joincircles.net',
            },
            {
              label: 'Circles Wallet',
              href: 'https://circles.garden',
            },
            {
              label: 'Code of Conduct',
              href: 'https://github.com/CirclesUBI/.github/blob/main/CODE_OF_CONDUCT.md',
            },
            {
              label: 'Contribute',
              href: 'https://github.com/CirclesUBI/.github/blob/main/CONTRIBUTING.md',
            },
          ],
        },
      ],
      copyright: `Creative Commons Attribution Share Alike 4.0 International`,
    },
  },
  presets: [
    [
      '@docusaurus/preset-classic',
      {
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          editUrl: 'https://github.com/CirclesUBI/circles-handbook/edit/main',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      },
    ],
  ],
};
