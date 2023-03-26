import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { getProfile } from 'applet-apis'
import { User } from 'applet-types'

interface UserState {
  token: String
  isAuthed: Boolean
  profile: User | null
  signinDialogVisible: Boolean
}

const initialState: UserState = {
  token: '',
  isAuthed: false,
  profile: null,
  signinDialogVisible: false
}

const fetchProfile = createAsyncThunk('users/getProfile', async () => {
  const response = await getProfile()
  return response
})

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    showSigninDialog (state) {
      state.signinDialogVisible = true
    },
    hideSigninDialog (state) {
      state.signinDialogVisible = false
    },
    initToken (state, action: PayloadAction<String>) {
      state.token = action.payload
    },
    updateAuthStatus (state, action: PayloadAction<String>) {
      state.token = action.payload
    },
    initProfile (state, action: PayloadAction<User>) {
      state.profile = action.payload
    },
    logout (state) {
      state.profile = null
      state.isAuthed = false
      state.token = ''
    }
  },
  extraReducers: (builder) => {
    // Add reducers for additional action types here, and handle loading state as needed
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      // Add user to the state array
      const profile: User = action.payload
      if (profile.id > 0) {
        state.profile = action.payload
        state.isAuthed = true
      }
    })
  }
})

export const { initToken, initProfile, showSigninDialog, hideSigninDialog, logout } = userSlice.actions
export { fetchProfile }
export default userSlice.reducer
