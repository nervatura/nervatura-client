import React from 'react';
import {create} from 'react-test-renderer';
import {render} from '@testing-library/react'

import Toast from './index';

describe('Toast', () => {

  it('Toast with exclamation', () => {

    const testRenderer = create(<Toast icon="exclamation" />);
    expect(testRenderer.root.findAllByType("svg").length).toBe(1)
  });

  it('Toast with success', () => {

    const testRenderer = create(<Toast icon="success" />);
    expect(testRenderer.root.findAllByType("svg").length).toBe(1)
  });

  it('Toast with info', () => {

    const testRenderer = create(<Toast icon="info" />);
    expect(testRenderer.root.findAllByType("svg").length).toBe(1)
  });

  it('Toast message', () => {

    const { getByText, rerender } = render(
      <Toast type="message" title="Title" message="<div>Message</div>" />);
    expect(getByText('Title').tagName).toEqual('DIV')

    rerender(<Toast type="message" message="<div>Message</div>" />);
    expect(getByText('Message').tagName).toEqual('DIV')
  });

  it('Toast without type', () => {

    const testRenderer = create(<Toast />);
    expect(testRenderer.root.findAllByType("svg").length).toBe(1)
  });
});