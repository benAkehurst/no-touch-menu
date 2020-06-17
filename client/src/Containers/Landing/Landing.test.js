import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Landing from './Landing';

configure({ adapter: new Adapter() });

describe('<Landing />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Landing />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
