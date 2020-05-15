import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Restaurant from './Restaurant';

configure({ adapter: new Adapter() });

describe('<Restaurant />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Restaurant />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
