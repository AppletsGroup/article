
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { useEffect, useLayoutEffect, useRef } from 'react'
import { Empty, useScrollTop } from 'applet-design'
import { loadPublicPosts, setCurrentPage } from 'store/reducers/publicPost'
import PublicArticleItem from 'components/PublicArticleItem/PublicArticleItem'
import { useReachBottom } from 'use-reach-bottom'

let lastScrollTop = 0

export default function PublicArticles() {
  const { hasNext, posts, currentPage, loadingPosts } = useAppSelector((state) => state.publicPost)
  const dispatch = useAppDispatch()
  const articlesRef = useRef(null)
  const scrollTop = useScrollTop()

  useEffect(() => {
    const initData = () => {
      void dispatch(loadPublicPosts())
    }
    if (!posts || posts.length === 0) initData()
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

  useReachBottom(articlesRef, () => {
    if (hasNext && !loadingPosts) {
      dispatch(setCurrentPage(currentPage + 1))
      void dispatch(loadPublicPosts())
    }
  })

  if (!loadingPosts && (!posts || (posts.length === 0))) {
    return <Empty />
  }

  const ArticlesList = posts.map((article, idx) => {
    return (
      <PublicArticleItem
        article={article}
        key={idx} />
    )
  })

  return (
    <div
      ref={articlesRef}>
      {ArticlesList}
      <div className="text-center py-5 text-stone-400">
        {hasNext ? (<div>loading</div>) : (<div>no more</div>)}
      </div>
    </div>
  )
}
