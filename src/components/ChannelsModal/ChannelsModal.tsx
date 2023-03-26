import { Modal } from 'components/Modal/Modal'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { loadChannels } from 'store/reducers/channel'
import { Channel } from 'applet-types'

export default function ChannelsModal({ isOpen, onClose, onSelect }: { isOpen: boolean, onClose: () => void, onSelect: (selectedChannel: Channel) => void }) {
  const { channels } = useAppSelector((state) => state.channel)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const initData = () => {
      void dispatch(loadChannels())
    }

    initData()
  }, [dispatch])

  const ChannelsList = channels.map((channelItem) => {
    return (
      <div
        key={channelItem.id}
        className="border mb-2 rounded-lg p-2"
        onClick={() => onSelect(channelItem)}>
        <div className="text-lg text-stone-800">{channelItem.title}</div>
        <div className="text-md text-stone-400">{channelItem.description}</div>
      </div>
    )
  })

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}>
      {ChannelsList}
    </Modal>
  )
}
