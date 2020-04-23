import { TOGGLE_EXAMPLE } from '../actions/testActions'
export default (
  state = {
    isWorking: null,
  },
  action: {
    type: String
  },
) => {
  switch (action.type) {
    case TOGGLE_EXAMPLE:
      return Object.assign({}, state, {
        isWorking: !state.isWorking,
      })
    default:
      return state
  }
}
