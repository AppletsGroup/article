import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit'
import dayjs from 'dayjs'
import { queryMyPosts } from 'applet-apis'
import { Post } from 'applet-types'

interface PostState {
  posts: Post[]
  currentPost: Post | null
  currentChannelId: number | null
  currentPage: number
  contentTypes: string[]
  hasNext: boolean
  loadingPosts: boolean
}

const initialState: PostState = {
  posts: [],
  currentPost: null,
  currentChannelId: null,
  currentPage: 1,
  contentTypes: ['DOCUMENT'],
  hasNext: true,
  loadingPosts: true
}

const loadPosts = createAsyncThunk('post/loadPosts', async (args, thunkAPI) => {
  const stateData: any = thunkAPI.getState()
  const { currentPage, contentTypes, currentChannelId } = stateData.post
  const queryParams: any = {
    page: currentPage,
    contentTypes,
    channelId: currentChannelId
  }
  const response = await queryMyPosts(queryParams)
  return response
})

const postSlice = createSlice({
  name: 'post',
  initialState,
  reducers: {
    setContentTypes (state, action: PayloadAction<string[]>) {
      state.contentTypes = action.payload
    },
    setCurrentPage (state, action: PayloadAction<number>) {
      state.currentPage = action.payload
    },
    initPosts (state, action: PayloadAction<any[]>) {
      state.posts = action.payload
    },
    loadMorePosts (state, action: PayloadAction<any[]>) {
      state.posts = state.posts.concat(action.payload)
    },
    postAdded (state, action: PayloadAction<any>) {
      const { newPost, isTimeline } = action.payload
      const newPostList = [newPost].concat(state.posts)

      if (!isTimeline) {
        state.posts = newPostList
      } else {
        newPostList.sort((post1, post2) => {
          const post1HappenedAt = dayjs(post1.happenedAt)
          const post2HappenedAt = dayjs(post2.happenedAt)
          return post2HappenedAt.diff(post1HappenedAt, 'seconds')
        })
        state.posts = newPostList
      }
    },
    likePostAction (state, action: PayloadAction<number>) {
      const postIndex = state.posts.findIndex((postItem) => {
        return postItem.id === action.payload
      })
      if (postIndex >= 0) {
        const postItem = state.posts[postIndex]
        postItem.liked = true
        postItem.likesCount = postItem.likesCount ? postItem.likesCount + 1 : 1
        state.posts[postIndex] = postItem
      }
    },
    disLikePostAction (state, action: PayloadAction<number>) {
      const postIndex = state.posts.findIndex((postItem) => {
        return postItem.id === action.payload
      })
      if (postIndex >= 0) {
        const postItem = state.posts[postIndex]
        postItem.liked = false
        postItem.likesCount = postItem.likesCount && postItem.likesCount > 1 ? postItem.likesCount - 1 : 0
        state.posts[postIndex] = postItem
      }
    },
    initCurrentPost (state, action: PayloadAction<any>) {
      state.currentPost = action.payload
    },
    likeCurrentPostAction (state, action: PayloadAction<number>) {
      const currentPost = state.currentPost
      if (currentPost != null) {
        currentPost.liked = true
        currentPost.likesCount = currentPost.likesCount ? currentPost.likesCount + 1 : 1
        state.currentPost = currentPost
      }
    },
    disLikeCurrentPostAction (state, action: PayloadAction<number>) {
      const currentPost = state.currentPost
      if (currentPost != null) {
        currentPost.liked = false
        currentPost.likesCount = currentPost.likesCount && currentPost.likesCount > 1 ? currentPost.likesCount - 1 : 0
        state.currentPost = currentPost
      }
    },
    addPostItemCommentCountAction (state, action: PayloadAction<number>) {
      const postIndex = state.posts.findIndex((postItem) => {
        return postItem.id === action.payload
      })
      if (postIndex >= 0) {
        const postItem = state.posts[postIndex]
        postItem.commentsCount = postItem.commentsCount ? postItem.commentsCount + 1 : 1
        state.posts[postIndex] = postItem
      }
    },
    addPostCommentCountAction (state, action: PayloadAction<number>) {
      const currentPost = state.currentPost
      if (currentPost != null) {
        currentPost.commentsCount = currentPost.commentsCount ? currentPost.commentsCount + 1 : 1
        state.currentPost = currentPost
      }
    },
    updateSinglePost (state, action: PayloadAction<any>) {
      const postIndex = state.posts.findIndex((postItem) => {
        return postItem.id === action.payload.id
      })
      if (postIndex >= 0) {
        state.posts[postIndex] = action.payload
      }
    },
    removePost (state, action: PayloadAction<any>) {
      const postIndex = state.posts.findIndex((postItem) => {
        return postItem.id === action.payload
      })
      if (postIndex >= 0) {
        state.posts.splice(postIndex, 1)
      }
    },
    setCurrentChannelId (state, action: PayloadAction<number | null>) {
      state.currentChannelId = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(loadPosts.pending, (state, action) => {
      state.loadingPosts = true
    })
    builder.addCase(loadPosts.fulfilled, (state, action) => {
      if (!action.payload) return
      const { data, hasNext } = action.payload
      if (state.currentPage > 1) {
        state.posts = state.posts.concat(data)
      } else {
        state.posts = data
      }
      state.hasNext = hasNext
      state.loadingPosts = false
    })
  }
})

export const {
  setContentTypes,
  setCurrentPage,
  initPosts,
  postAdded,
  loadMorePosts,
  likePostAction,
  disLikePostAction,
  initCurrentPost,
  likeCurrentPostAction,
  disLikeCurrentPostAction,
  addPostItemCommentCountAction,
  addPostCommentCountAction,
  updateSinglePost,
  setCurrentChannelId,
  removePost
} = postSlice.actions
export default postSlice.reducer
export { loadPosts }
