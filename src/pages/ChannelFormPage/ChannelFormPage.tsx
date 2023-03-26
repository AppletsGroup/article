import { Button, InputField } from 'applet-design'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { createChannel } from 'applet-apis'
import toast from 'react-hot-toast'

export default function ChannelFormPage() {
  const titleInputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const handleSaveChannel = async () => {
    const channelTitle = titleInputRef.current?.value

    if (!channelTitle || channelTitle === '') {
      toast.error('Title is required')
      return
    }

    const channel2Create = { title: channelTitle }
    await createChannel(channel2Create)

    navigate(-1)
  }

  return (
    <div className="mx-auto max-w-3xl pt-2 px-5 lg:px-0">
      <div className="py-3">Channel Form</div>
      <div>
        <InputField
          placeholder="input channel title"
          ref={titleInputRef} />
      </div>
      <Button
        className="mt-5"
        onClick={handleSaveChannel}>
        Save
      </Button>
    </div>
  )
}
