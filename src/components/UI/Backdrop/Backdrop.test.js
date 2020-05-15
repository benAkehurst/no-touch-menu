import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Backdrop from './Backdrop';

configure({ adapter: new Adapter() });

describe('<Backdrop />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Backdrop />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
