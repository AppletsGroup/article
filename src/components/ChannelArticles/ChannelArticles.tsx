import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { loadChannelPosts, setPostPage, setChannelId } from 'store/reducers/channel'
import ArticleItem from '../ArticleItem/ArticleItem'
import { Post } from 'applet-types'

export default function ChannelArticles(props: {
  channelId: Number
}) {
  const { channelId } = props
  const { channelPosts } = useAppSelector(state => state.channel)
  const dispatch = useAppDispatch()

  useEffect(() => {
    const queryPosts = () => {
      dispatch(setChannelId(Number(channelId)))
      dispatch(setPostPage(1))
      void dispatch(loadChannelPosts())
    }

    queryPosts()
  }, [channelId, dispatch])

  const PostsList = channelPosts && channelPosts.length > 0
    ? channelPosts.map((item: Post, idx: number) => {
      return (
        <ArticleItem
          article={item}
          key={idx} />
      )
    })
    : (<div className="post-item"><div>sad</div></div>)

  return (
    <div>
      {PostsList}
    </div>
  )
}
