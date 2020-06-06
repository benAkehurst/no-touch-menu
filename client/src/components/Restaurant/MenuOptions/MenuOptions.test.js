import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MenuOptions from './MenuOptions';

configure({ adapter: new Adapter() });

describe('<MenuOptions />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<MenuOptions />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
