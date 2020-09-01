const remarkPartials = require("remark-import-partial");

module.exports = {
  title: "React MX",
  tagline: "Build React components visually",
  url: "https://github.com/getiuui/react-mx/README.md",
  baseUrl: "/",
  onBrokenLinks: "warn",
  favicon: "img/favicon.ico",
  organizationName: "getiuui",
  projectName: "ReactMX",
  themeConfig: {
    navbar: {
      logo: {
        alt: "React MX logo",
        src: "/img/mx-logo-transparent.svg",
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
              to: "docs/what-is-reactmx",
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
          remarkPlugins: [remarkPartials],
        },
        theme: {
          customCss: require.resolve("./src/css/custom.css"),
        },
      },
    ],
  ],
  stylesheets: [
    "https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,600;0,700;0,800;1,300;1,400;1,600;1,700;1,800&display=swap",
    "https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",
    "https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100;0,200;0,300;0,400;0,423;0,500;0,600;0,700;1,100;1,200;1,300;1,400;1,423;1,500;1,600;1,700&display=swap",
  ],
};
