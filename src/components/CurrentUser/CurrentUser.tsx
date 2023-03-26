
import { useEffect } from 'react'
import { useAppSelector, useAppDispatch } from 'store/hooks'
import { fetchProfile, logout } from 'store/reducers/user'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Dropdown } from 'applet-design'
import { Link, useNavigate } from 'react-router-dom'

export default function CurrentUser() {
  const userProfile = useAppSelector((state) => state.user.profile)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const initProfile = () => {
      void dispatch(fetchProfile())
    }

    initProfile()
  }, [dispatch])

  const logOut = () => {
    dispatch(logout())
    navigate('/')
  }

  const handleGotoAuthPage = () => {
    window.location.href = `https://auth.applets.group?redirectUrl=${location.href}`
  }

  if (userProfile == null) {
    return (
      <div
        onClick={handleGotoAuthPage}
        className="cursor-pointer py-3 text-stone-900 font-bold">
        Log in
      </div>
    )
  }

  return (
    <Dropdown
      overlay={(
        <div className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            <Link
              to="/articles"
              className="block w-full px-4 py-2 text-left text-sm"
            >
              Articles
            </Link>
            <button
              onClick={logOut}
              className='text-gray-700 block w-full px-4 py-2 text-left text-sm'
            >
              Sign out
            </button>
          </div>
        </div>
      )}
    >
      <div className="flex items-center">
        <img
          className="w-8 h-8 rounded-full cursor-pointer mr-2"
          src={userProfile?.avatarUrl + '!avatar'}
          alt="Avatar" />
        <ChevronDownIcon
          className="h-3 w-3"
          aria-hidden="true" />
      </div>
    </Dropdown>
  )
}
