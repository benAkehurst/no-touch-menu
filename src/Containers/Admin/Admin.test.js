import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Admin from './Admin';

configure({ adapter: new Adapter() });

describe('<Admin />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Admin />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
