import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { getChannel, queryChannels, queryChannelPosts } from 'applet-apis'
import { Channel, Post } from 'applet-types'

interface ChannelState {
  currentChannel: Channel | null
  channelPosts: Post[]
  hasMorePosts: boolean
  postPage: number
  channelId: number | null
  channels: Channel[]
  hasMoreChannels: boolean
  channelPage: number
  loadingPosts: boolean
  loadingChannels: boolean
}

const initialState: ChannelState = {
  currentChannel: null,
  channelPosts: [],
  hasMorePosts: true,
  postPage: 1,
  channelId: null,
  channels: [],
  hasMoreChannels: true,
  channelPage: 1,
  loadingPosts: false,
  loadingChannels: false
}

const fetchChannel = createAsyncThunk(
  'channel/getChannel',
  async (channelId: number) => {
    const response = await getChannel(channelId)
    return response
  }
)

const loadChannelPosts = createAsyncThunk(
  'channel/loadChannelPosts',
  async (args, thunkAPI) => {
    const stateData: any = thunkAPI.getState()
    const { postPage, channelId, currentCategoryId } = stateData.channel
    if (channelId > 0) {
      const queryParams: {
        page: number
        channelId: number
        categoryId?: number
      } = { page: postPage, channelId }
      if (currentCategoryId > 0) queryParams.categoryId = currentCategoryId
      const response = await queryChannelPosts(queryParams)
      return response
    }
  }
)

const loadChannels = createAsyncThunk(
  'channel/loadChannels',
  async (args, thunkAPI) => {
    const stateData: any = thunkAPI.getState()
    const { channelPage } = stateData.channel
    const response = await queryChannels(channelPage)
    return response
  }
)

const channelSlice = createSlice({
  name: 'channel',
  initialState,
  reducers: {
    setPostPage (state, action: PayloadAction<number>) {
      state.postPage = action.payload
    },
    setChannelPage (state, action: PayloadAction<number>) {
      state.channelPage = action.payload
    },
    setChannelId (state, action: PayloadAction<number>) {
      console.log('action.payload::', action.payload)
      state.channelId = action.payload
    },
    channelPostAdded (state, action: PayloadAction<{
      newPost: Post
      isTimeline?: boolean
    }>) {
      const { newPost } = action.payload
      const newPostList = [newPost].concat(state.channelPosts)

      newPostList.sort((post1, post2) => {
        const post1HappenedAt = dayjs(post1.happenedAt)
        const post2HappenedAt = dayjs(post2.happenedAt)
        return post2HappenedAt.diff(post1HappenedAt, 'seconds')
      })
      state.channelPosts = newPostList
    },
    emptyChannelPosts (state) {
      state.channelPosts = []
    },

    updateSingleChannelPost (state, action: PayloadAction<any>) {
      const postIndex = state.channelPosts.findIndex((postItem) => {
        return postItem.id === action.payload.id
      })
      if (postIndex >= 0) {
        state.channelPosts[postIndex] = action.payload
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(fetchChannel.fulfilled, (state, action) => {
      const channel = action.payload
      if (channel.id > 0) {
        state.currentChannel = action.payload
      }
    })
    builder.addCase(loadChannelPosts.fulfilled, (state, action) => {
      const { data, hasNext } = action.payload
      if (state.postPage === 1) {
        state.channelPosts = data
      } else {
        state.channelPosts = state.channelPosts.concat(data)
      }
      state.hasMorePosts = hasNext
      state.loadingPosts = false
    })
    builder.addCase(loadChannelPosts.pending, (state, action) => {
      state.loadingPosts = true
    })
    builder.addCase(loadChannels.fulfilled, (state, action) => {
      const { data, hasNext } = action.payload
      if (state.channelPage === 1) {
        state.channels = data
      } else {
        state.channels = state.channels.concat(data)
      }
      state.hasMoreChannels = hasNext
      state.loadingChannels = false
    })
    builder.addCase(loadChannels.pending, (state, action) => {
      state.loadingChannels = true
    })
  }
})

export const { setPostPage, setChannelId, channelPostAdded, emptyChannelPosts, setChannelPage, updateSingleChannelPost } =
  channelSlice.actions
export default channelSlice.reducer
export { fetchChannel, loadChannelPosts, loadChannels }
