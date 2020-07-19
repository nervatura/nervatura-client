import React from 'react';
import {render} from '@testing-library/react'

import { UserLock, ExclamationTriangle, CheckCircle, InfoCircle, HandUp, Bars, Exit,
  Envelop, Phone, Mobile, User, Close, Edit, Star, Cog, FileText, ChartBar, Bolt,
  CheckSquare, Square, Calendar, CaretRight, Eye, Search, QuestionCircle,
  Inbox, Print, Globe, Share, Times, Filter, Download, Columns, Plus,
  SquareEmpty, Check, CheckSquareEmpty, ToggleOff, ToggleOn, Home, Money, 
  ListOl, ListUl, Barcode, Dollar, Tag, Truck, Male, Magic, Th, Briefcase, Lock,
  Map, ShoppingCart, Flask, Clock, Strikethrough, Keyboard, Book, TextHeight, 
  Ticket, Wrench, Key, Comment, Bold, Italic, Underline, Upload, Copy,
  Reply, ArrowLeft, ArrowRight, Sitemap, Undo, Link, Code, Retweet } from './index';

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

  it('ToggleOn should render a SVG', () => {

    const { container } = render(<ToggleOn />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('ToggleOff should render a SVG', () => {

    const { container } = render(<ToggleOff />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Home should render a SVG', () => {

    const { container } = render(<Home />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Money should render a SVG', () => {

    const { container } = render(<Money />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('ListOl should render a SVG', () => {

    const { container } = render(<ListOl />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('ListUl should render a SVG', () => {

    const { container } = render(<ListUl />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Barcode should render a SVG', () => {

    const { container } = render(<Barcode />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Dollar should render a SVG', () => {

    const { container } = render(<Dollar />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Tag should render a SVG', () => {

    const { container } = render(<Tag />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Truck should render a SVG', () => {

    const { container } = render(<Truck />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Male should render a SVG', () => {

    const { container } = render(<Male />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Magic should render a SVG', () => {

    const { container } = render(<Magic />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Th should render a SVG', () => {

    const { container } = render(<Th />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Briefcase should render a SVG', () => {

    const { container } = render(<Briefcase />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Lock should render a SVG', () => {

    const { container } = render(<Lock />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Map should render a SVG', () => {

    const { container } = render(<Map />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('ShoppingCart should render a SVG', () => {

    const { container } = render(<ShoppingCart />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Flask should render a SVG', () => {

    const { container } = render(<Flask />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Clock should render a SVG', () => {

    const { container } = render(<Clock />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Strikethrough should render a SVG', () => {

    const { container } = render(<Strikethrough />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Keyboard should render a SVG', () => {

    const { container } = render(<Keyboard />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Book should render a SVG', () => {

    const { container } = render(<Book />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('TextHeight should render a SVG', () => {

    const { container } = render(<TextHeight />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Ticket should render a SVG', () => {

    const { container } = render(<Ticket />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });
  
  it('Wrench should render a SVG', () => {

    const { container } = render(<Wrench />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Key should render a SVG', () => {

    const { container } = render(<Key />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Comment should render a SVG', () => {

    const { container } = render(<Comment />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Bold should render a SVG', () => {

    const { container } = render(<Bold />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Italic should render a SVG', () => {

    const { container } = render(<Italic />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Underline should render a SVG', () => {

    const { container } = render(<Underline />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Upload should render a SVG', () => {

    const { container } = render(<Upload />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Copy should render a SVG', () => {

    const { container } = render(<Copy />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Reply should render a SVG', () => {

    const { container } = render(<Reply />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('ArrowLeft should render a SVG', () => {

    const { container } = render(<ArrowLeft />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('ArrowRight should render a SVG', () => {

    const { container } = render(<ArrowRight />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Sitemap should render a SVG', () => {

    const { container } = render(<Sitemap />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Undo should render a SVG', () => {

    const { container } = render(<Undo />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Link should render a SVG', () => {

    const { container } = render(<Link />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Code should render a SVG', () => {

    const { container } = render(<Code />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });

  it('Retweet should render a SVG', () => {

    const { container } = render(<Retweet />);
    expect(container.querySelector('svg').childElementCount).toEqual(1)
  });
});