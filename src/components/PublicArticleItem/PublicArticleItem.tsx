import { useNavigate } from 'react-router-dom'
import { getPostTitle } from 'utils/post'
import { fromNow } from 'utils/time'
import { Post } from 'applet-types'

export default function PublicArticleItem({ article }: { article: Post }) {
  const navigate = useNavigate()

  const handleGotoDetail = () => {
    navigate(`/article/${article.id}`)
  }

  const artileTitle = getPostTitle(article)
  const createdTimeFromNow = article.createdAt ? fromNow(article.createdAt) : ''

  return (
    <div
      onClick={handleGotoDetail}
      className="mb-6 border-b pb-6 cursor-pointer">
      <div className="flex items-center mb-3">
        <img
          src={article.author?.avatarUrl}
          className="w-8 h-8 rounded-full"
          alt="avatar" />
        <div className="text-stone-800 ml-2 text-sm">{article.author?.name}</div>
        <div className="text-sm ml-2 text-stone-500">{createdTimeFromNow}</div>
      </div>
      {artileTitle && <div className="text-2xl text-stone-900 mb-3">{artileTitle}</div>}
      <div className="text-lg text-stone-600 break-all">{article.store.shortContent}</div>
    </div>
  )
}
