import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, ScrollTop } from './MenuBar.stories';

afterEach(() => {
  jest.clearAllMocks();
});

it('renders the card in the Default state', () => {
  const loadModule = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_menu"
    loadModule={loadModule}  />
  );
  expect(container.querySelector('#test_menu')).toBeDefined();

  const mnu_search_large = container.querySelector('#mnu_search_large')
  fireEvent.click(mnu_search_large)
  expect(loadModule).toHaveBeenCalledTimes(1);

  const mnu_edit_large = container.querySelector('#mnu_edit_large')
  fireEvent.click(mnu_edit_large)
  expect(loadModule).toHaveBeenCalledTimes(2);

  const mnu_setting_large = container.querySelector('#mnu_setting_large')
  fireEvent.click(mnu_setting_large)
  expect(loadModule).toHaveBeenCalledTimes(3);

  const mnu_bookmark_large = container.querySelector('#mnu_bookmark_large')
  fireEvent.click(mnu_bookmark_large)
  expect(loadModule).toHaveBeenCalledTimes(4);

  const mnu_help_large = container.querySelector('#mnu_help_large')
  fireEvent.click(mnu_help_large)
  expect(loadModule).toHaveBeenCalledTimes(5);

  const mnu_logout_large = container.querySelector('#mnu_logout_large')
  fireEvent.click(mnu_logout_large)
  expect(loadModule).toHaveBeenCalledTimes(6);

})

it('renders the card in the ScrollTop state', () => {
  const setScroll = jest.fn()
  const sideBar = jest.fn()

  const { container } = render(
    <ScrollTop {...ScrollTop.args} id="test_menu"
    setScroll={setScroll} sideBar={sideBar}  />
  );
  expect(container.querySelector('#test_menu')).toBeDefined();

  const mnu_scroll = container.querySelector('#mnu_scroll')
  fireEvent.click(mnu_scroll)
  expect(setScroll).toHaveBeenCalledTimes(1);

  const mnu_sidebar = container.querySelector('#mnu_sidebar')
  fireEvent.click(mnu_sidebar)
  expect(sideBar).toHaveBeenCalledTimes(1);

})

it('renders the card in the Medium state', () => {
  const loadModule = jest.fn()

  window.matchMedia = jest.fn().mockImplementation(query => {
    return {
      matches: query === '(min-width: 601px) and (max-width: 992px)' ? false:true ,
      media: '',
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    };
  });

  const { container } = render(
    <Default {...Default.args} id="test_menu"
    loadModule={loadModule}  />
  );

  const mnu_logout_medium = container.querySelector('#mnu_logout_medium')
  fireEvent.click(mnu_logout_medium)
  expect(loadModule).toHaveBeenCalledTimes(1);

  const mnu_help_medium = container.querySelector('#mnu_help_medium')
  fireEvent.click(mnu_help_medium)
  expect(loadModule).toHaveBeenCalledTimes(2);

  const mnu_bookmark_medium = container.querySelector('#mnu_bookmark_medium')
  fireEvent.click(mnu_bookmark_medium)
  expect(loadModule).toHaveBeenCalledTimes(3);

  const mnu_setting_medium = container.querySelector('#mnu_setting_medium')
  fireEvent.click(mnu_setting_medium)
  expect(loadModule).toHaveBeenCalledTimes(4);

  const mnu_edit_medium = container.querySelector('#mnu_edit_medium')
  fireEvent.click(mnu_edit_medium)
  expect(loadModule).toHaveBeenCalledTimes(5);

  const mnu_search_medium = container.querySelector('#mnu_search_medium')
  fireEvent.click(mnu_search_medium)
  expect(loadModule).toHaveBeenCalledTimes(6);

})