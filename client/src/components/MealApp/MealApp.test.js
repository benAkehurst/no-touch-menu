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

  it('should render the component', () => {
    expect(wrapper).toBeTruthy();
  });

  it('should call the menu download method', () => {
    const method = (MealApp.prototype.downloadMealAppPDF = jest.fn());
    const component = new MealApp();
    component.downloadMealAppPDF();
    expect(method).toHaveBeenCalledTimes(1);
  });

  it('should call the menu download method as admin', () => {
    const method = (MealApp.prototype.downloadMealAppPDFAdmin = jest.fn());
    const component = new MealApp();
    component.downloadMealAppPDFAdmin();
    expect(method).toHaveBeenCalledTimes(1);
  });

  it('should call the view qr code method', () => {
    const method = (MealApp.prototype.viewQrCode = jest.fn());
    const component = new MealApp();
    component.viewQrCode();
    expect(method).toHaveBeenCalledTimes(1);
  });

  it('should call the remove meal app method', () => {
    const method = (MealApp.prototype.removeMealAppObject = jest.fn());
    const component = new MealApp();
    component.removeMealAppObject();
    expect(method).toHaveBeenCalledTimes(1);
  });
});
