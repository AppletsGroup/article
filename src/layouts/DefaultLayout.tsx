import CurrentUser from 'components/CurrentUser/CurrentUser'
import { useEffect } from 'react'
import { Link, Outlet, useNavigate, useSearchParams } from 'react-router-dom'
import { useAppSelector } from 'store/hooks'

export default function DefaultLayout () {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const isAuthed = useAppSelector((state) => state.user.isAuthed)

  const token = searchParams.get('token')
  if (token) {
    localStorage.setItem('TOKEN', token)
  }

  useEffect(() => {
    if (token) {
      searchParams.delete('token')
      setSearchParams(searchParams)
    }
  }, [])

  const handleGotoCreateArticle = () => {
    navigate('/article/new')
  }

  return (
    <>
      <div className="flex justify-between items-center py-2 border-b px-4">
        <Link
          className="text-xl text-stone-900"
          to="/">
          Article
        </Link>

        <div className="flex justify-end items-center">
          {isAuthed && (<div
            onClick={handleGotoCreateArticle}
            className="cursor-pointer text-stone-500">
            Write
          </div>)}
          <div className="ml-8"><CurrentUser /></div>
        </div>
      </div>
      <Outlet />
    </>
  )
}
