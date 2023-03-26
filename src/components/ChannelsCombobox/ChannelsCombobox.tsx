import { Combobox2 } from 'applet-design'
import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { loadChannels } from 'store/reducers/channel'
import { Channel } from 'applet-types'

export default function ChannelsCombobox({ selected, onChange }: {
  selected: {
    title: string
    id: number
  } | null
  onChange: (selectedChannel: Channel) => void
}) {
  const { channels } = useAppSelector((state) => state.channel)

  const dispatch = useAppDispatch()

  useEffect(() => {
    const initData = () => {
      void dispatch(loadChannels())
    }

    initData()
  }, [dispatch])

  const items = channels.map((channelItem) => {
    return {
      title: channelItem.title,
      id: channelItem.id
    }
  })

  if (!items || (items.length === 0)) {
    return <div></div>
  }

  return (
    <div className="flex items-center z-10">
      <Combobox2
        items={items}
        onChange={onChange}
        selected={selected} />
    </div>
  )
}
