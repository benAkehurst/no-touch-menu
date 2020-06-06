import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import RestaurantOptions from './RestaurantOptions';

configure({ adapter: new Adapter() });

describe('<RestaurantOptions />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<RestaurantOptions />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
