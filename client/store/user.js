import axios from 'axios'


/**
 * ACTION TYPES
 */
const GET_USER = 'GET_USER'
const REMOVE_USER = 'REMOVE_USER'

/**
 * INITIAL STATE
 */
const defaultUser = {}

/** 
 * ACTION CREATORS
*/
const getUser = user => ({type: GET_USER, user})
const removeUser = () => ({type: REMOVE_USER})

/** 
 * THUNK CREATORS
*/
export const me = () => async dispatch => {
  try {
    const res = await axios.get('/auth/me')
    dispatch(getUser(res.data || defaultUser))
  } catch (err) {
    console.log(err(err))
  }
}

/** 
 * REDUCER
*/
export default function (state = defaultUser, action) {
  switch (action.type) {
    case GET_USER:
      return action.user
    default:
      return state
  }
}