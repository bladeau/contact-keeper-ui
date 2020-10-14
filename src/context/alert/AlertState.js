import React, { useReducer } from 'react'
import { v4 as uuid } from 'uuid'
import { AlertContext, AlertDispatchContext } from './alertContext'
import alertReducer from './alertReducer'
import { SET_ALERT, REMOVE_ALERT } from '../types'

const AlertState = (props) => {
  const initialState = []
  const [state, dispatch] = useReducer(alertReducer, initialState)

  const setAlertDispatch = (msg, type, timeout = 5000) => {
    const id = uuid()
    dispatch({
      type: SET_ALERT,
      payload: { msg, type, id },
    })
    setTimeout(() => dispatch({ type: REMOVE_ALERT, payload: id }), timeout)
  }

  return (
    <AlertContext.Provider
      value={{
        alerts: state,
      }}
    >
      <AlertDispatchContext.Provider value={setAlertDispatch}>
        {props.children}
      </AlertDispatchContext.Provider>
    </AlertContext.Provider>
  )
}

export default AlertState
