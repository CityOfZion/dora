import { Dispatch, Action } from 'redux'
import { WSDoraData } from '../reducers/nodeReducer'

export interface NodeDTO extends Action<string> {
  data: WSDoraData
}

export const SET_NODE = 'SET_NODE'
export const setNode =
  (nodeData: WSDoraData) =>
  (dispatch: Dispatch<NodeDTO>): void => {
    dispatch({
      type: SET_NODE,
      data: nodeData,
    })
  }
