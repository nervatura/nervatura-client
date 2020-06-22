import { lazy } from 'react'

/* istanbul ignore next */
const Search = lazy(() => import('containers/Search'));
const Login = lazy(() => import('containers/Login'));
const Editor = lazy(() => import('containers/Editor'));

export default {
  "login": Login,
  "search": Search,
  "edit": Editor,
  "setting": Search,
  "bookmark": Search,
  "help": Search
}