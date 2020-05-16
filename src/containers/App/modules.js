import { lazy } from 'react'

/* istanbul ignore next */
const Search = lazy(() => import('containers/Search'));
const Login = lazy(() => import('containers/Login'));

export default {
  "login": Login,
  "search": Search,
  "edit": Search,
  "setting": Search,
  "bookmark": Search,
  "help": Search
}