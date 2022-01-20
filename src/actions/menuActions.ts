import { Dispatch } from 'redux'

export const OPEN_MENU = 'OPEN_MENU'
export const openMenu =
  () =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: OPEN_MENU,
    })
  }

export const CLOSE_MENU = 'CLOSE_MENU'
export const closeMenu =
  () =>
  (dispatch: Dispatch): void => {
    dispatch({
      type: CLOSE_MENU,
    })
  }
