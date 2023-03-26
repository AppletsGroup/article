import {
  useEditor,
  defaultPreset,
  EditorProvider,
  EditorContent
} from 'nonepub'
import 'nonepub/style.css'
import { Link, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getPost } from 'applet-apis'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import { initCurrentPost } from 'store/reducers/post'
import { formatTime } from 'utils/time'
import { Dropdown } from 'applet-design'
import { EllipsisHorizontalIcon } from '@heroicons/react/24/solid'

export default function ArticlePage() {
  const { articleId } = useParams<{ articleId: string, groupId: string, postId: string }>()

  const [loaded, setLoaded] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const { isAuthed, profile } = useAppSelector(state => state.user)
  const { currentPost } = useAppSelector(state => state.post)
  const isAuthor = isAuthed && (profile != null) && profile.id === currentPost?.authorId

  const dispatch = useAppDispatch()

  useEffect(() => {
    const loadPost = async () => {
      const res = await getPost(Number(articleId))
      if (res) {
        const postBlock = res ? res.postBlocks[0] : null
        if (postBlock) {
          setTitle(postBlock.block.content.title || '')
          setContent(postBlock.block.content.text || '')
        }
        dispatch(initCurrentPost(res))
      }
      setLoaded(true)
    }

    if (articleId) {
      void loadPost()
    } else {
      setLoaded(true)
    }
  }, [dispatch, articleId, isAuthed])

  const options = defaultPreset(
    {
      type: 'html',
      value: content || ''
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
          }, 1000)
        })
      },
      readonly: true
    }
  )
  const editor = useEditor(options)

  if (!loaded) {
    return (
      <div>Loading...</div>
    )
  }

  return (
    <div className="mx-auto max-w-3xl pt-2">
      <div className="flex justify-between items-center px-3 py-2">
        <div className="flex">
          <img
            src={currentPost?.author?.avatarUrl}
            alt="avatar"
            className="w-12 h-12 rounded-full" />
          <div className="ml-3">
            <div>{currentPost?.author?.name}</div>
            <div className="text-stone-500">{currentPost?.createdAt ? formatTime(currentPost?.createdAt) : ''}</div>
          </div>
        </div>
        {isAuthor && (
          <Dropdown
            overlay={(
              <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                <div className="py-1">
                  <Link
                    to={`/article/edit/${articleId}`}
                    className="block w-full px-4 py-2 text-left text-sm"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            )}
          >
            <div className="flex items-center">
              <EllipsisHorizontalIcon
                className="h-7 w-7 text-stone-500"
                aria-hidden="true" />
            </div>
          </Dropdown>
        )}
      </div>
      <div className="mt-2 py-5 px-3">
        <div className="text-left text-3xl">{title}</div>
      </div>
      <EditorProvider editor={editor}>
        <EditorContent />
      </EditorProvider>
    </div>
  )
}
