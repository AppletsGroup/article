
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { loadChannels } from 'store/reducers/channel'
import { useEffect } from 'react'
import ChannelItem from 'components/ChannelItem/ChannelItem'
import { useNavigate } from 'react-router-dom'

export default function ChannelsPage() {
  const { channels } = useAppSelector((state) => state.channel)
  const navigate = useNavigate()

  const dispatch = useAppDispatch()

  useEffect(() => {
    const initData = () => {
      void dispatch(loadChannels())
    }

    initData()
  }, [dispatch])

  const gotoChannelDetail = (id) => {
    navigate(`/channel/${id}`)
  }

  const ChannelsList = channels.map((channelItem, idx) => {
    return (
      <ChannelItem
        channel={channelItem}
        key={idx}
        onClick={() => gotoChannelDetail(channelItem.id)} />
    )
  })

  return (
    <div>
      {ChannelsList}
    </div>
  )
}
