import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import InfoDisplay from './InfoDisplay';

configure({ adapter: new Adapter() });

describe('<InfoDisplay />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<InfoDisplay />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
