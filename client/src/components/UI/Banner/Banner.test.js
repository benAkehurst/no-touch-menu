import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Banner from './Banner';

configure({ adapter: new Adapter() });

describe('<Banner />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Banner />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
