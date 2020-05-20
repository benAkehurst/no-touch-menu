import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import User from './User';

configure({ adapter: new Adapter() });

describe('<User />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<User />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
