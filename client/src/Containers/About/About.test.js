import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import About from './About';

configure({ adapter: new Adapter() });

describe('<About />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<About />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
