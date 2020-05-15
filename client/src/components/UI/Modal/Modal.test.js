import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Modal from './Modal';

configure({ adapter: new Adapter() });

describe('<Modal />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Modal />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
