import { useNavigate } from 'react-router-dom'
import { getPostTitle } from 'utils/post'
import { Post } from 'applet-types'

export default function ArticleItem({ article }: { article: Post }): JSX.Element {
  const navigate = useNavigate()

  const handleGotoDetail = (): void => {
    navigate(`/article/${article.id}`)
  }

  const artileTitle = getPostTitle(article)

  return (
    <div
      onClick={handleGotoDetail}
      className="mb-6 border-b pb-6 cursor-pointer">
      {artileTitle !== null && <div className="text-2xl text-stone-900 mb-3">{artileTitle}</div>}
      <div className="text-lg text-stone-600 break-all">{article.store.shortContent}</div>
    </div>
  )
}
