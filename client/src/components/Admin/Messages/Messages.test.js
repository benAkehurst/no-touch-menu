import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Messages from './Messages';

configure({ adapter: new Adapter() });

describe('<Messages />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Messages />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
