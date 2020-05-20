import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Menu from './Menu';

configure({ adapter: new Adapter() });

describe('<Menu />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Menu />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
