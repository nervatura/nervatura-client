import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, DarkLogin } from './Login.stories';

it('renders the card in the Default state', () => {
  const setLocale = jest.fn()
  const changeData = jest.fn()
  const setTheme = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_login"
    changeData={changeData}  setLocale={setLocale} setTheme={setTheme} />
  );
  expect(container.querySelector('#test_login')).toBeDefined();

  const username = container.querySelector('#username')
  fireEvent.change(username, {target: {value: "username"}})
  expect(changeData).toHaveBeenCalledTimes(1);

  const password = container.querySelector('#password')
  fireEvent.change(password, {target: {value: "password"}})
  expect(changeData).toHaveBeenCalledTimes(2);

  const database = container.querySelector('#database')
  fireEvent.change(database, {target: {value: "database"}})
  expect(changeData).toHaveBeenCalledTimes(3);

  const server = container.querySelector('#server')
  fireEvent.change(server, {target: {value: "server"}})
  expect(changeData).toHaveBeenCalledTimes(4);

  const sb_lang = container.querySelector('#lang')
  fireEvent.change(sb_lang, {target: {value: "jp"}})
  expect(setLocale).toHaveBeenCalledTimes(1);

  const cmd_theme = container.querySelector('#theme')
  fireEvent.click(cmd_theme)
  expect(setTheme).toHaveBeenCalledTimes(1);

});

it('renders the card in the DarkLogin state', () => {
  const onLogin = jest.fn()

  const { container } = render(
    <DarkLogin {...DarkLogin.args} id="test_login"
    onLogin={onLogin} />
  );
  expect(container.querySelector('#test_login')).toBeDefined();

  const cmd_login = container.querySelector('#login')
  fireEvent.click(cmd_login)
  expect(onLogin).toHaveBeenCalledTimes(1);

});