
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useEffect, useLayoutEffect, useRef } from 'react'
import ArticleItem from 'components/ArticleItem/ArticleItem'
import { loadPosts, setCurrentChannelId, setCurrentPage } from 'store/reducers/post'
import { Empty, useReachBottom, useScrollTop } from 'applet-design'
import { useSearchParams } from 'react-router-dom'

let lastScrollTop = 0

export default function Articles() {
  const { hasNext, posts, currentPage, loadingPosts } = useAppSelector((state) => state.post)
  const dispatch = useAppDispatch()
  const articlesRef = useRef(null)
  const scrollTop = useScrollTop()
  const [searchParams] = useSearchParams()

  useEffect(() => {
    const initData = (): void => {
      const channelId = searchParams.get('channelId')
      if (channelId !== null) {
        dispatch(setCurrentChannelId(Number(channelId)))
      }
      void dispatch(loadPosts())
    }
    if (posts === null || posts.length === 0) initData()
  }, [dispatch])

  useLayoutEffect(() => {
    if (lastScrollTop > 0) {
      const a = document.querySelector('.applet-design')
      a?.scrollTo(0, lastScrollTop)
    }
  }, [])

  useEffect(() => {
    if (scrollTop > 0 || lastScrollTop === 0) {
      lastScrollTop = scrollTop
    }
  }, [scrollTop])

  useReachBottom(() => {
    if (hasNext && !loadingPosts) {
      dispatch(setCurrentPage(currentPage + 1))
      void dispatch(loadPosts())
    }
  })

  if (!loadingPosts && (posts.length === 0)) {
    return <Empty />
  }

  const ArticlesList = posts.map((article, idx) => {
    return (
      <ArticleItem
        article={article}
        key={idx} />
    )
  })

  return (
    <div ref={articlesRef}>
      {ArticlesList}
      <div className="text-center py-5 text-stone-400">
        {hasNext ? (<div>loading</div>) : (<div>no more</div>)}
      </div>
    </div>
  )
}
