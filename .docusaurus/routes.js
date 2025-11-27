import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/blog',
    component: ComponentCreator('/blog', 'b2f'),
    exact: true
  },
  {
    path: '/blog/archive',
    component: ComponentCreator('/blog/archive', '182'),
    exact: true
  },
  {
    path: '/blog/authors',
    component: ComponentCreator('/blog/authors', '0b7'),
    exact: true
  },
  {
    path: '/blog/authors/all-sebastien-lorber-articles',
    component: ComponentCreator('/blog/authors/all-sebastien-lorber-articles', '4a1'),
    exact: true
  },
  {
    path: '/blog/authors/yangshun',
    component: ComponentCreator('/blog/authors/yangshun', 'a68'),
    exact: true
  },
  {
    path: '/blog/first-blog-post',
    component: ComponentCreator('/blog/first-blog-post', '89a'),
    exact: true
  },
  {
    path: '/blog/long-blog-post',
    component: ComponentCreator('/blog/long-blog-post', '9ad'),
    exact: true
  },
  {
    path: '/blog/mdx-blog-post',
    component: ComponentCreator('/blog/mdx-blog-post', 'e9f'),
    exact: true
  },
  {
    path: '/blog/tags',
    component: ComponentCreator('/blog/tags', '287'),
    exact: true
  },
  {
    path: '/blog/tags/docusaurus',
    component: ComponentCreator('/blog/tags/docusaurus', '704'),
    exact: true
  },
  {
    path: '/blog/tags/facebook',
    component: ComponentCreator('/blog/tags/facebook', '858'),
    exact: true
  },
  {
    path: '/blog/tags/hello',
    component: ComponentCreator('/blog/tags/hello', '299'),
    exact: true
  },
  {
    path: '/blog/tags/hola',
    component: ComponentCreator('/blog/tags/hola', '00d'),
    exact: true
  },
  {
    path: '/blog/welcome',
    component: ComponentCreator('/blog/welcome', 'd2b'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '563'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '022'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '374'),
            routes: [
              {
                path: '/docs/category/tutor',
                component: ComponentCreator('/docs/category/tutor', '373'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/intro',
                component: ComponentCreator('/docs/intro', 'dff'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/Linq/chapter/chapter-01',
                component: ComponentCreator('/docs/Linq/chapter/chapter-01', '9f4'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/Linq/chapter/chapter-02',
                component: ComponentCreator('/docs/Linq/chapter/chapter-02', '0ab'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/Linq/chapter/chapter-03',
                component: ComponentCreator('/docs/Linq/chapter/chapter-03', 'cd1'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/Linq/chapter/chapter-04',
                component: ComponentCreator('/docs/Linq/chapter/chapter-04', '40f'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/Linq/chapter/chapter-05',
                component: ComponentCreator('/docs/Linq/chapter/chapter-05', 'c9b'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/Linq/chapter/chapter-06',
                component: ComponentCreator('/docs/Linq/chapter/chapter-06', '0e0'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/Linq/chapter/chapter-07',
                component: ComponentCreator('/docs/Linq/chapter/chapter-07', '949'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/Linq/chapter/chapter-08',
                component: ComponentCreator('/docs/Linq/chapter/chapter-08', 'b99'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/Linq/chapter/chapter-09',
                component: ComponentCreator('/docs/Linq/chapter/chapter-09', 'df0'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/Linq/chapter/chapter-10',
                component: ComponentCreator('/docs/Linq/chapter/chapter-10', '97f'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/Linq/chapter/chapter-11',
                component: ComponentCreator('/docs/Linq/chapter/chapter-11', '58a'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/Linq/chapter/chapter-12',
                component: ComponentCreator('/docs/Linq/chapter/chapter-12', '68a'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/Linq/chapter/chapter-13',
                component: ComponentCreator('/docs/Linq/chapter/chapter-13', '689'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/Linq/chapter/chapter-14',
                component: ComponentCreator('/docs/Linq/chapter/chapter-14', '548'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/Linq/chapter/chapter-15',
                component: ComponentCreator('/docs/Linq/chapter/chapter-15', '004'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/Linq/intro',
                component: ComponentCreator('/docs/Linq/intro', '09c'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/sql/chapter-02',
                component: ComponentCreator('/docs/sql/chapter-02', '934'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-01',
                component: ComponentCreator('/docs/SQL/chapter/chapter-01', '464'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-03',
                component: ComponentCreator('/docs/SQL/chapter/chapter-03', '275'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-04',
                component: ComponentCreator('/docs/SQL/chapter/chapter-04', '814'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-05',
                component: ComponentCreator('/docs/SQL/chapter/chapter-05', '565'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-06',
                component: ComponentCreator('/docs/SQL/chapter/chapter-06', 'cdd'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-07',
                component: ComponentCreator('/docs/SQL/chapter/chapter-07', '7b9'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-08',
                component: ComponentCreator('/docs/SQL/chapter/chapter-08', '819'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-09',
                component: ComponentCreator('/docs/SQL/chapter/chapter-09', 'd92'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-10',
                component: ComponentCreator('/docs/SQL/chapter/chapter-10', 'a35'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-11',
                component: ComponentCreator('/docs/SQL/chapter/chapter-11', '1ea'),
                exact: true,
                sidebar: "learningSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-12',
                component: ComponentCreator('/docs/SQL/chapter/chapter-12', '422'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-13',
                component: ComponentCreator('/docs/SQL/chapter/chapter-13', 'a1e'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-14',
                component: ComponentCreator('/docs/SQL/chapter/chapter-14', '122'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-15',
                component: ComponentCreator('/docs/SQL/chapter/chapter-15', 'f77'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-16',
                component: ComponentCreator('/docs/SQL/chapter/chapter-16', 'fab'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-17',
                component: ComponentCreator('/docs/SQL/chapter/chapter-17', '29a'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-18',
                component: ComponentCreator('/docs/SQL/chapter/chapter-18', 'b5f'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-19',
                component: ComponentCreator('/docs/SQL/chapter/chapter-19', '1ce'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/SQL/chapter/chapter-20',
                component: ComponentCreator('/docs/SQL/chapter/chapter-20', '7e8'),
                exact: true,
                sidebar: "tutorialSidebar"
              },
              {
                path: '/docs/sql/intro',
                component: ComponentCreator('/docs/sql/intro', '57d'),
                exact: true,
                sidebar: "learningSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', '2e1'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
