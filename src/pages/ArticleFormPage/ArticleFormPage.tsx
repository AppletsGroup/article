import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { createPost, getPost, updatePost, updateBlock } from 'applet-apis'
import {
  useEditor,
  defaultPreset,
  mobilePreset
} from 'nonepub'
import { postAdded } from 'store/reducers/post'
import { useAppDispatch } from 'store/hooks'
import { channelPostAdded } from 'store/reducers/channel'
import { Button, InputField, useIsMobile } from 'applet-design'
import ChannelsCombobox from 'components/ChannelsCombobox/ChannelsCombobox'
import NonePubEditor from 'components/NonePubEditor/NonePubEditor'
import { ArrowLeftIcon } from '@heroicons/react/24/solid'
import { Post } from 'applet-types'
import { useApplet } from 'applet-shell'

export default function ArticleFormPage() {
  const { articleId } = useParams<{ articleId: string }>()
  const applet = useApplet()
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const [currentPost, setCurrentPost] = useState<Post>()
  const [loaded, setLoaded] = useState(false)
  const titleInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [resetEditorContent, setResetEditorContent] = useState(false)
  const [selectedChannel, setSelectedChannel] = useState<null | {
    title: string
    id: number
  }>(null)
  const isMobile = useIsMobile()

  const editorPreset = isMobile ? mobilePreset : defaultPreset

  const options = editorPreset(
    {
      type: 'html',
      value: content || ' '
    },
    {
      uploader: async (file) => {
        return await new Promise((resolve, reject) => {
          setTimeout(() => {
            const uri = URL.createObjectURL(file)
            console.log('upload uri', uri)
            resolve({
              src: uri
            })
          }, 4000)
        })
      },
      readonly: false
    }
  )
  const editor = useEditor(options)

  useEffect(() => {
    const loadPost = async () => {
      const res = await getPost(Number(articleId))
      if (res) {
        const postBlock = res ? res.postBlocks[0] : null
        if (postBlock) {
          setTitle(postBlock.block.content.title || '')
          setContent(postBlock.block.content.text || '')
        }
        if (res.channel) {
          const postChannel = res.channel
          setSelectedChannel({
            title: postChannel.title,
            id: postChannel.id
          })
        }
      }
      setCurrentPost(res)
      setLoaded(true)
    }

    if (articleId) {
      void loadPost()
    } else {
      setLoaded(true)
    }
  }, [articleId])

  if (!loaded) {
    return (
      <div>Loading...</div>
    )
  }

  const handleConfirmSave = async () => {
    const htmlString = editor.getContentHtml()
    const docTitle = titleInputRef.current?.value
    const shortContent = htmlString.replace(/<[^>]+>/g, '').substring(0, 100)

    if (currentPost != null) {
      const postBlock = currentPost?.postBlocks != null ? currentPost.postBlocks[0] : null
      const postBlockId = postBlock.block.id

      await updateBlock({
        blockId: postBlockId,
        content: { text: htmlString, title: docTitle }
      })

      await updatePost({
        channelId: (selectedChannel != null) ? selectedChannel.id : undefined,
        postId: Number(articleId),
        shortContent
      })

      navigate(`/article/${articleId}`, { replace: true })
    } else {
      const blocks2Create = [
        {
          content: { text: htmlString, title: docTitle },
          contentType: 'Text'
        }
      ]

      const post2Create: Post = {
        contentType: 'DOCUMENT',
        blocks: blocks2Create,
        shortContent,
        isDraft: false
      }
      if (selectedChannel != null) post2Create.channelId = selectedChannel.id
      const newPost = await createPost(post2Create)

      if (selectedChannel != null) {
        dispatch(channelPostAdded({
          newPost,
          isTimeline: false
        }))
      } else {
        dispatch(postAdded({
          newPost,
          isTimeline: false
        }))
        if (titleInputRef.current != null) titleInputRef.current.value = ''
        setResetEditorContent(!resetEditorContent)
      }
      applet?.toast.success('create article success')
      navigate(`/article/${newPost.id}`, { replace: true })
    }
  }

  const handleChannelChange = (selectedItem) => {
    setSelectedChannel(selectedItem)
  }

  return (
    <>
      <div className="flex justify-between items-center py-2 border-b px-4">
        <div
          onClick={() => navigate(-1)}
          className="cursor-pointer">
          <ArrowLeftIcon className="h-5 w-5 text-solid-900" />
        </div>

        <div className="flex justify-end items-center">
          <ChannelsCombobox
            onChange={handleChannelChange}
            selected={selectedChannel} />
          <Button
            onClick={handleConfirmSave}
            className="ml-2">
            Done
          </Button>
        </div>
      </div>
      <div className="mx-auto max-w-xl px-5 lg:px-0">
        <InputField
          defaultValue={title}
          ref={titleInputRef}
          placeholder='Article title' />
        <NonePubEditor editor={editor} />
      </div>
    </>
  )
}
