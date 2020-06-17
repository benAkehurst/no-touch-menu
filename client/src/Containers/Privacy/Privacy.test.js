import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Privacy from './Privacy';

configure({ adapter: new Adapter() });

describe('<Privacy />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Privacy />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
