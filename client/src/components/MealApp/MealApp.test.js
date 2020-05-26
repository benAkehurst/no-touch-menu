import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MealApp from './MealApp';

configure({ adapter: new Adapter() });

describe('<MealApp />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<MealApp />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
