import { Dispatch } from 'redux'

export const TOGGLE_EXAMPLE = 'TOGGLE_EXAMPLE'

export const toggleExample = () => (dispatch: Dispatch) => {
  dispatch({
    type: TOGGLE_EXAMPLE,
    receivedAt: Date.now(),
  })
}
