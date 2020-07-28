import { CLOSE_MENU, OPEN_MENU } from '../actions/menuActions'
import { AnyAction } from 'redux'

export type State = {
  open: boolean
}

const INITIAL_STATE = {
  open: false,
}

export default (state: State = INITIAL_STATE, action: AnyAction): State => {
  switch (action.type) {
    case CLOSE_MENU:
      return Object.assign({}, state, {
        open: false,
      })
    case OPEN_MENU:
      return Object.assign({}, state, {
        open: true,
      })

    default:
      return state
  }
}
