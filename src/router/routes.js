const routes = [
  {
    path: '/',
    redirect: '/posts',
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: 'posts',
        component: () => import('pages/PostsPage.vue'),
      },
      {
        path: 'posts/search',
        component: () => import('pages/PostsPage.vue'),
      },
      {
        path: 'posts/create',
        component: () => import('pages/CreatePostPage.vue'),
      },
      {
        path: 'posts/:id',
        component: () => import('pages/PostDetailsPage.vue'),
      },
      {
        path: 'posts/edit/:id',
        component: () => import('pages/EditPostPage.vue'),
      },
      {
        path: 'auth',
        component: () => import('pages/AuthPage.vue'),
      },
    ],
  },
]

export default routes
