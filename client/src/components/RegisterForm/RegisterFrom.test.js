import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import RegisterForm from './RegisterForm';

configure({ adapter: new Adapter() });

describe('<RegisterForm />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<RegisterForm />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
