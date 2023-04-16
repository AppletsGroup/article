import {
  Route,
  createBrowserRouter,
  createRoutesFromElements,
  RouterProvider
} from 'react-router-dom'
import HomePage from './pages/HomePage/HomePage'
import ArticlePage from './pages/ArticlePage/ArticlePage'
import { Provider } from 'react-redux'
import { store } from './store'
import ChannelPage from './pages/ChannelPage/ChannelPage'
import ChannelsPage from 'pages/ChannelsPage/ChannelsPage'
import ArticleFormPage from 'pages/ArticleFormPage/ArticleFormPage'
import ChannelFormPage from 'pages/ChannelFormPage/ChannelFormPage'
import ArticlesPage from 'pages/ArticlesPage/ArticlesPage'
import { AppletProvider, DefaultLayout } from 'applet-shell'

const menus = [
  { path: '/', label: 'Home' },
  { path: '/articles', label: 'Articles' },
  { path: '/article/new', label: 'Write' }
]

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route
        element={(
          <DefaultLayout
            menus={menus}
            title="Article" />
      )}>
        <Route
          path="/"
          index
          element={<HomePage />} />
        <Route
          path="/channel/form"
          element={<ChannelFormPage />} />
        <Route
          path="/articles"
          index
          element={<ArticlesPage />} />
        <Route
          path="/channels"
          element={<ChannelsPage />} />
        <Route
          path="/channel/:channelId"
          element={<ChannelPage />} />
        <Route
          path="/article/:articleId"
          element={<ArticlePage />} />
      </Route>
      <Route
        path="/article/new"
        element={<ArticleFormPage />} />
      <Route
        path="/article/edit/:articleId"
        element={<ArticleFormPage />} />
    </>
  )
)

function App() {
  return (
    <AppletProvider>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </AppletProvider>
  )
}

export default App
