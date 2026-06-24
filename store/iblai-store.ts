/**
 * ibl.ai Redux store.
 */

import { configureStore } from '@reduxjs/toolkit'
import {
  coreApiSlice,
  mcpApiSlice,
  mentorMiddleware,
  mentorReducer,
} from '@iblai/iblai-js/data-layer'
import {
  chatInputSliceReducer,
  chatSliceReducerShared,
  filesReducer,
  hostChatReducer,
  rbacReducer,
  subscriptionReducer,
  topBannerReducer,
} from '@iblai/iblai-js/web-utils'

export const iblaiStore = configureStore({
  reducer: {
    chat: hostChatReducer,
    chatInput: chatInputSliceReducer,
    chatSliceShared: chatSliceReducerShared,
    files: filesReducer,
    rbac: rbacReducer,
    subscription: subscriptionReducer,
    topBanner: topBannerReducer,
    [coreApiSlice.reducerPath]: coreApiSlice.reducer,
    [mcpApiSlice.reducerPath]: mcpApiSlice.reducer,
    ...mentorReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(coreApiSlice.middleware)
      .concat(mcpApiSlice.middleware)
      .concat(...mentorMiddleware),
})

export type IblaiRootState = ReturnType<typeof iblaiStore.getState>
export type IblaiAppDispatch = typeof iblaiStore.dispatch
