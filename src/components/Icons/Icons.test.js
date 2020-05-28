import React from 'react';
import {render} from '@testing-library/react'

import { UserLock, ExclamationTriangle, CheckCircle, InfoCircle, HandUp, Bars, Exit,
  Envelop, Phone, Mobile, User, Close, Edit, Star, Cog, FileText, ChartBar, Bolt,
  CheckSquare, Square, Calendar, CaretRight, Eye, Search, QuestionCircle,
  Inbox, Print, Globe, Share, Times, Filter, Download, Columns, Plus,
  SquareEmpty, Check, CheckSquareEmpty } from './index';

describe('Icons', () => {

  it('UserLock should render a SVG', () => {

    const { container } = render(<UserLock />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('ExclamationTriangle should render a SVG', () => {

    const { container } = render(<ExclamationTriangle />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('CheckCircle should render a SVG', () => {

    const { container } = render(<CheckCircle />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('InfoCircle should render a SVG', () => {

    const { container } = render(<InfoCircle />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Close should render a SVG', () => {

    const { container } = render(<Close />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Envelop should render a SVG', () => {

    const { container } = render(<Envelop />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Phone should render a SVG', () => {

    const { container } = render(<Phone />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Mobile should render a SVG', () => {

    const { container } = render(<Mobile />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('User should render a SVG', () => {

    const { container } = render(<User />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('HandUp should render a SVG', () => {

    const { container } = render(<HandUp />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Bars should render a SVG', () => {

    const { container } = render(<Bars />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Exit should render a SVG', () => {

    const { container } = render(<Exit />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('CheckSquare should render a SVG', () => {

    const { container } = render(<CheckSquare />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Square should render a SVG', () => {

    const { container } = render(<Square />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Calendar should render a SVG', () => {

    const { container } = render(<Calendar />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('CaretRight should render a SVG', () => {

    const { container } = render(<CaretRight />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Eye should render a SVG', () => {

    const { container } = render(<Eye />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Search should render a SVG', () => {

    const { container } = render(<Search />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('QuestionCircle should render a SVG', () => {

    const { container } = render(<QuestionCircle />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Edit should render a SVG', () => {

    const { container } = render(<Edit />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Cog should render a SVG', () => {

    const { container } = render(<Cog />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Star should render a SVG', () => {

    const { container } = render(<Star />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('FileText should render a SVG', () => {

    const { container } = render(<FileText />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('ChartBar should render a SVG', () => {

    const { container } = render(<ChartBar />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Bolt should render a SVG', () => {

    const { container } = render(<Bolt />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Inbox should render a SVG', () => {

    const { container } = render(<Inbox />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Print should render a SVG', () => {

    const { container } = render(<Print />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Globe should render a SVG', () => {

    const { container } = render(<Globe />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Share should render a SVG', () => {

    const { container } = render(<Share />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Times should render a SVG', () => {

    const { container } = render(<Times />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Filter should render a SVG', () => {

    const { container } = render(<Filter />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Download should render a SVG', () => {

    const { container } = render(<Download />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Columns should render a SVG', () => {

    const { container } = render(<Columns />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Plus should render a SVG', () => {

    const { container } = render(<Plus />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Check should render a SVG', () => {

    const { container } = render(<Check />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('SquareEmpty should render a SVG', () => {

    const { container } = render(<SquareEmpty />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('CheckSquareEmpty should render a SVG', () => {

    const { container } = render(<CheckSquareEmpty />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });
});