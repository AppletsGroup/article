import { Channel } from 'applet-types'

export default function ChannelItem({ channel, onClick }: { channel: Channel, onClick: () => void }) {
  return (
    <div
      onClick={onClick}
      className="flex mb-5 border-b pb-5 cursor-pointer">
      <img
        className="w-16 h-16 rounded-lg"
        src={channel.avatarUrl}
        alt="Channel Avatar" />
      <div className="ml-3" >{channel.title}</div>
    </div>
  )
}
