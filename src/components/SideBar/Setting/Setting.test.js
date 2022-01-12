import { render, queryByAttribute, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';

import { Default, DatabaseGroup, UserGroup, TemplateEditor, FormItemAll, FormItemNew, FormItemRead } from './Setting.stories';
import { SIDE_VISIBILITY } from "./Setting";

const getById = queryByAttribute.bind(null, 'id');

it('renders in the Default state', () => {
  const onGroup = jest.fn()
  const onMenu = jest.fn()

  const { container } = render(
    <Default {...Default.args} id="test_menu" onGroup={onGroup} onMenu={onMenu} />
  );
  expect(getById(container, "test_menu")).toBeDefined();

  const btn_numberdef = getById(container, 'cmd_numberdef')
  fireEvent.click(btn_numberdef)
  expect(onMenu).toHaveBeenCalledTimes(1);

  const btn_database = getById(container, 'group_database')
  fireEvent.click(btn_database)
  expect(onGroup).toHaveBeenCalledTimes(1);

  render(
    <Default {...Default.args} 
      auditFilter={{
        setting: ["all", 1],
        audit: ["disabled", 1]
      }} />
  )

})

it('renders in the DatabaseGroup state', () => {

  const { container } = render(
    <DatabaseGroup {...DatabaseGroup.args} id="test_menu" />
  );
  expect(getById(container, "test_menu")).toBeDefined();

})

it('renders in the UserGroup state', () => {

  const { container } = render(
    <UserGroup {...UserGroup.args} id="test_menu" />
  );
  expect(getById(container, "test_menu")).toBeDefined();

})

it('renders in the TemplateEditor state', () => {

  const { container } = render(
    <TemplateEditor {...TemplateEditor.args} id="test_menu" />
  );
  expect(getById(container, "test_menu")).toBeDefined();

  render(
    <TemplateEditor {...TemplateEditor.args} 
      side={SIDE_VISIBILITY.SHOW} 
      module={{ 
        template: {
          key: "_blank"
        }
      }}
    />
  )

  render(
    <TemplateEditor {...TemplateEditor.args} 
      module={{ 
        dirty: false, 
        template: {}
      }}
    />
  )
})

it('renders in the FormItemAll state', () => {

  const { container } = render(
    <FormItemAll {...FormItemAll.args} id="test_menu" />
  );
  expect(getById(container, "test_menu")).toBeDefined();

})

it('renders in the FormItemNew state', () => {

  const { container } = render(
    <FormItemNew {...FormItemNew.args} id="test_menu" />
  );
  expect(getById(container, "test_menu")).toBeDefined();

})

it('renders in the FormItemRead state', () => {

  const { container } = render(
    <FormItemRead {...FormItemRead.args} id="test_menu" />
  );
  expect(getById(container, "test_menu")).toBeDefined();

})