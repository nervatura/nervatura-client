import { lazy } from 'react'

/* istanbul ignore next */
const Search = lazy(() => import('containers/Search'));
const Login = lazy(() => import('containers/Login'));
const Editor = lazy(() => import('containers/Editor'));
const Setting = lazy(() => import('containers/Setting'));

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  "login": Login,
  "search": Search,
  "edit": Editor,
  "setting": Setting,
  "help": Search
}