import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Test from './Test';

configure({ adapter: new Adapter() });

describe('<Test />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Test />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
