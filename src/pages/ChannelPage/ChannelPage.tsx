
import ChannelArticles from 'components/ChannelArticles/ChannelArticles'
import { useParams } from 'react-router-dom'
// import { useAppSelector, useAppDispatch } from 'store/hooks'

export default function ChannelPage() {
  const { channelId } = useParams<{ channelId: string }>()
  // const currentChannel = useAppSelector((state) => state.channel.currentChannel)

  const handleCreateNewArticle = () => { }

  return (
    <div>
      this is channel detail page...
      <div onClick={handleCreateNewArticle}>
        create article
      </div>
      {channelId && <ChannelArticles channelId={Number(channelId)} />}
    </div>
  )
}
