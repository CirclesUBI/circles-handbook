module.exports = {
  users: ['users/foreword', 'users/what-is-ubi', 'users/what-is-circles'],
  communities: [
    'communities/social-economic-organization',
    'communities/principles',
    'communities/democratic-assemblies',
    'communities/self-sustainability',
    'communities/decentralization',
    'communities/local-solutions',
    'communities/democratic-confederalism',
    'communities/credit',
    'communities/pricing-guidelines',
  ],
  developers: [
    'developers/getting-started',
    'developers/whitepaper',
    {
      type: 'category',
      label: 'Architecture',
      items: [
        // @TODO
        // 'developers/wallets',
        // 'developers/trust-network',
        // 'developers/transitive-transfers',
        // 'developers/ubi-inflation',
        // 'developers/dead-man-switch',
      ],
    },
    {
      type: 'category',
      label: 'API Reference',
      items: [
        // @TODO
        // {
        //   type: 'link',
        //   label: 'circles-contracts',
        //   href: '',
        // },
        {
          type: 'link',
          label: 'circles-core',
          href: 'https://circlesubi.github.io/circles-core',
        },
        // @TODO
        // {
        //   type: 'link',
        //   label: 'circles-transfer',
        //   href: '',
        // },
        {
          type: 'link',
          label: 'circles-api',
          href: 'https://github.com/CirclesUBI/circles-api/blob/main/API.md',
        },
        // @TODO
        // {
        //   type: 'link',
        //   label: 'safe-relay-service',
        //   href: '',
        // },
      ],
    },
    {
      type: 'category',
      label: 'Transitive transactions',
      items: [
        'developers/transitive-transactions/transfer-limitations-in-practice',
        {
          type: 'link',
          label: 'circles-api',
          href: 'https://github.com/CirclesUBI/circles-api/blob/main/API.md',
        },
      ],
    },
    'developers/tutorials',
    //{
    //  type: 'category',
    //  label: 'Tutorial',
    //  items: [
    //    @TODO
    //    'developers/basic-client',
    //    'developers/graph-queries',
    //    'developers/deploy-contracts',
    //    'developers/run-server',
    //  ],
    //},
    {
      type: 'link',
      label: 'FAQ',
      href: 'https://joincircles.net/faq',
    },
    {
      type: 'link',
      label: 'Contributing',
      href: 'https://github.com/CirclesUBI/.github/blob/main/CONTRIBUTING.md',
    },
  ],
};
