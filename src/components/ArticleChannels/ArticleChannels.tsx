import React, { useRef, useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { loadChannels } from 'store/reducers/channel'
import { setCurrentChannelId, loadPosts, setCurrentPage } from 'store/reducers/post'
import { PlusIcon, ChevronDoubleDownIcon } from '@heroicons/react/24/solid'
import ChannelsModal from 'components/ChannelsModal/ChannelsModal'
import { useIsOverflow } from 'applet-design'

function classNames(...classes: string[]): string {
  return classes.filter(Boolean).join(' ')
}

export default function ArticleChannels(): JSX.Element {
  const { channels } = useAppSelector((state) => state.channel)
  const channelsRef = useRef<HTMLDivElement>(null)
  const dispatch = useAppDispatch()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [searchParams, setSearchParams] = useSearchParams()
  const selectedChannelId = (searchParams.get('channelId') != null) ? Number(searchParams.get('channelId')) : null

  const isOverflow = useIsOverflow({ ref: channelsRef }, [channels])

  useEffect(() => {
    const initData = (): void => {
      void dispatch(loadChannels())
    }

    initData()
  }, [dispatch])

  const handleSwitchChannel = (channelId): void => {
    dispatch(setCurrentChannelId(channelId))
    dispatch(setCurrentPage(1))
    void dispatch(loadPosts())
    if (channelId > 0) {
      searchParams.set('channelId', channelId)
    } else {
      searchParams.delete('channelId')
    }
    setSearchParams(searchParams)
  }

  const ChannelsList = channels.map((channelItem, idx) => {
    const isSelected = selectedChannelId === channelItem.id
    return (
      <div
        key={idx}
        className={
          classNames(
            isSelected ? 'text-stone-900' : 'text-stone-500',
            'whitespace-nowrap mr-5 cursor-pointer text-lg'
          )
        }
        onClick={() => handleSwitchChannel(channelItem.id)}>
        {channelItem.title}
      </div>
    )
  })

  const handleOpenChannelsModal = (): void => {
    setIsModalOpen(true)
  }

  const handleSelectChannel = (selectedChannel): void => {
    setIsModalOpen(false)
    handleSwitchChannel(selectedChannel.id)
  }

  return (
    <>
      <div className="flex border-b truncate mb-8 justify-between items-center">
        <div
          className="flex w-full overflow-scroll py-5 items-center"
          ref={channelsRef}>
          <Link
            className="text-2xl pr-6 cursor-pointer"
            to="/channel/form">
            <PlusIcon className="h-5 w-5 text-solid-900" />
          </Link>
          <div
            className={classNames(
              selectedChannelId === null ? 'text-stone-900' : 'text-stone-500',
              'whitespace-nowrap mr-5 cursor-pointer text-lg')}
            onClick={() => handleSwitchChannel(null)}>
            All Channels
          </div>
          {ChannelsList}
        </div>
        {
          isOverflow && (
            <div
              className="pl-2 cursor-pointer"
              onClick={handleOpenChannelsModal}>
              <ChevronDoubleDownIcon className="h-5 w-5 text-gray-400" />
            </div>
          )
        }
      </div>
      {isModalOpen && (
        <ChannelsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSelect={handleSelectChannel} />
      )}
    </>
  )
}
