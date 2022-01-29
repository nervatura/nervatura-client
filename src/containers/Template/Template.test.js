import React from 'react';
import { render, queryByAttribute } from '@testing-library/react'
import update from 'immutability-helper';

import Template from './index';
import { store as app_store  } from 'config/app'
import { AppProvider } from 'containers/App/context'
import { Default as EditorData } from 'components/Report/PDF/TemplateEditor.stories'

import { appActions } from 'containers/App/actions'
import { templateActions } from 'containers/Template/actions'

jest.mock("containers/App/actions");
jest.mock("containers/Template/actions");

const getById = queryByAttribute.bind(null, 'id');

const store = update(app_store, {$merge: {
  template: {
    ...EditorData.args.data,
  }
}})

describe('<Template />', () => {
  beforeEach(() => {
    appActions.mockReturnValue({
      getText: EditorData.args.getText,
    })
    templateActions.mockReturnValue({
      createMap: jest.fn(),
      goNext: jest.fn()
    })
  });
  
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders in the Template state', () => {
    const setData = jest.fn()

    const { container, rerender } = render(
      <AppProvider value={{ data: store, setData: setData }}>
        <Template id="template" />
      </AppProvider>
    );
    expect(getById(container, 'template')).toBeDefined();

    rerender(
      <AppProvider value={{ data: store, setData: setData }}>
        <Template />
      </AppProvider>
    )
  });

})