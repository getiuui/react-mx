module.exports = {
  title: "React MX",
  tagline: "Build React components visually",
  url: "https://github.com/getiuui/react-mx/README.md",
  baseUrl: "/",
  onBrokenLinks: "throw",
  favicon: "img/favicon.ico",
  organizationName: "getiuui",
  projectName: "ReactMX",
  themeConfig: {
    navbar: {
      logo: {
        alt: "React MX logo",
        src: "https://i.imgur.com/n7UZNjk.png",
      },
      items: [
        {
          href: "https://github.com/getiuui/react-mx",
          label: "GitHub",
          position: "right",
        },
      ],
    },
    footer: {
      style: "dark",
      links: [
        {
          title: "Docs",
          items: [
            {
              label: "About",
              to: "docs/what-is-reactmd",
            },
            {
              label: "Features",
              to: "docs/features",
            },
          ],
        },
        {
          title: "More",
          items: [
            {
              label: "GitHub",
              href: "https://github.com/getiuui/react-mx",
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} ReactMX`,
    },
  },
  presets: [
    [
      "@docusaurus/preset-classic",
      {
        docs: {
          path: "../docs",
          homePageId: "what-is-reactmx",
          sidebarPath: require.resolve("./sidebars.json"),
          editUrl: "https://github.com/getiuui/react-mx",
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
};
