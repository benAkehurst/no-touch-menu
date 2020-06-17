import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Faq from './Faq';

configure({ adapter: new Adapter() });

describe('<Faq />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Faq />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
