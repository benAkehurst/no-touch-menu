import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Uploader from './Uploader';

configure({ adapter: new Adapter() });

describe('<Uploader />', () => {
  let wrapper;

  beforeEach(() => {
    wrapper = shallow(<Uploader />);
  });

  it('should render the compoent', () => {
    expect(wrapper).toBeTruthy();
  });
});
