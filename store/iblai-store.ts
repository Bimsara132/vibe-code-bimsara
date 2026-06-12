/**
 * ibl.ai Redux store.
 */

import { configureStore } from '@reduxjs/toolkit'
import {
  coreApiSlice,
  mentorMiddleware,
  mentorReducer,
} from '@iblai/iblai-js/data-layer'
import {
  chatSliceReducerShared,
  filesReducer,
} from '@iblai/iblai-js/web-utils'

export const iblaiStore = configureStore({
  reducer: {
    [coreApiSlice.reducerPath]: coreApiSlice.reducer,
    ...mentorReducer,
    chatSliceShared: chatSliceReducerShared,
    files: filesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .concat(coreApiSlice.middleware)
      .concat(...mentorMiddleware),
})

export type IblaiRootState = ReturnType<typeof iblaiStore.getState>
export type IblaiAppDispatch = typeof iblaiStore.dispatch
