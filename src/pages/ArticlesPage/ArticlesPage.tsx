import ArticleChannels from 'components/ArticleChannels/ArticleChannels'
import Articles from 'components/Articles/Articles'

export default function ArticlesPage () {
  return (
    <>
      <div className="mx-auto max-w-3xl px-5 lg:px-0 sticky top-0 bg-white">
        <ArticleChannels />
      </div>
      <div className="mx-auto max-w-3xl px-5 lg:px-0">
        <Articles />
      </div>
    </>
  )
}
