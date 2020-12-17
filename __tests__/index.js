// Tests for Collapsible.
import React from 'react';
import { configure, shallow, mount, render } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import Collapsible from '../src/Collapsible';

configure({ adapter: new Adapter() });

const dummyEvent = { preventDefault: () => {}};

class CollapsibleStateContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {open: !this.props.changeOpenTo};
  }
  componentDidMount(){
    this.setState({open: this.props.changeOpenTo});
  }
  render() {
    return <Collapsible {...this.props} open={this.state.open}/>;
  }
}

describe('<Collapsible />', () => {
  it('renders an element with the class `.Collapsible`.', () => {
    const wrapper = shallow(<Collapsible />);
    expect(wrapper.is('.Collapsible')).toEqual(true);
  });

  it('renders Collapsible with trigger text.', () => {
    const wrapper = shallow(<Collapsible trigger='Hello World'/> )
    expect(wrapper.find('span').text()).toEqual('Hello World')
  });

  it('given a closed Collapsible fires the onOpening prop when clicked to open', () => {
    const mockOnOpening = jest.fn();
    const collapsible = mount(<Collapsible trigger='Hello World' onOpening={mockOnOpening}/>);
    const trigger = collapsible.find('.Collapsible__trigger');

    expect(trigger).toHaveLength(1);
    trigger.simulate('click', dummyEvent);
    expect(mockOnOpening.mock.calls).toHaveLength(1);
  });

  it('given an open Collapsible fires the onClosing prop when clicked to close', () => {
    const mockOnClosing = jest.fn();
    const collapsible = mount(<Collapsible open trigger='Hello World' onClosing={mockOnClosing}/> );
    const trigger = collapsible.find('.Collapsible__trigger');

    expect(trigger).toHaveLength(1);
    trigger.simulate('click', dummyEvent);
    expect(mockOnClosing.mock.calls).toHaveLength(1);
  });

  it('given a closed Collapsible it fires the onOpen prop after the transistion', () => {
    const mockOnOpen = jest.fn();
    const collapsible = shallow(<Collapsible open trigger='Hello World' onOpen={mockOnOpen}>Some Content</Collapsible> );
    const outer = collapsible.find('.Collapsible__contentOuter');
    
    expect(outer).toHaveLength(1);
    outer.simulate('transitionEnd', dummyEvent);
    expect(mockOnOpen.mock.calls).toHaveLength(1);
  });

  it('given an open Collapsible it fires the onClose prop after the transistion', () => {
    const mockOnClose = jest.fn();
    const collapsible = shallow(<Collapsible trigger='Hello World' onClose={mockOnClose}>Some Content</Collapsible> );
    const outer = collapsible.find('.Collapsible__contentOuter');
    
    expect(outer).toHaveLength(1);
    outer.simulate('transitionEnd', dummyEvent);
    expect(mockOnClose.mock.calls).toHaveLength(1);
  });

  it('given a Collapsible with the handleTriggerClick prop, the handleTriggerClick prop gets fired', () => {
    const mockHandleTriggerClick = jest.fn();
    const collapsible = shallow(<Collapsible handleTriggerClick={mockHandleTriggerClick} trigger="Hello world" />);
    const trigger = collapsible.find('.Collapsible__trigger');

    expect(trigger).toHaveLength(1);
    trigger.simulate('click', dummyEvent);
    expect(mockHandleTriggerClick.mock.calls).toHaveLength(1);
  })
  
  describe('onTriggerOpening prop', () => {
    it('is called when a closed Collapsible is triggered', () => {
      const mockOnTriggerOpening = jest.fn();
      const collapsible = mount(<Collapsible trigger='Hello World' onTriggerOpening={mockOnTriggerOpening} />);
      const trigger = collapsible.find('.Collapsible__trigger');
      
      expect(trigger).toHaveLength(1);
      trigger.simulate('click', dummyEvent);
      expect(mockOnTriggerOpening.mock.calls).toHaveLength(1);
    });
    
    it("is not called when a closed collapsible's open prop changes to true", () => {
      const mockOnTriggerOpening = jest.fn();
      const collapsible = mount(<CollapsibleStateContainer changeOpenTo={true} trigger='Hello World' onTriggerOpening={mockOnTriggerOpening} />);
      const trigger = collapsible.find('.Collapsible__trigger');
      
      expect(trigger).toHaveLength(1);
      expect(mockOnTriggerOpening.mock.calls).toHaveLength(0);
    });
  });
  
  describe('onTriggerClosing prop', () => {
    it('is called when an open Collapsible is triggered', () => {
      const mockOnTriggerClosing = jest.fn();
      const collapsible = mount(<Collapsible open trigger='Hello World' onTriggerClosing={mockOnTriggerClosing} />);
      const trigger = collapsible.find('.Collapsible__trigger');
      
      expect(trigger).toHaveLength(1);
      trigger.simulate('click', dummyEvent);
      expect(mockOnTriggerClosing.mock.calls).toHaveLength(1);
    });
    
    it("is not called when an open collapsible's open prop changes to false", () => {
      const mockOnTriggerClosing = jest.fn();
      const collapsible = mount(<CollapsibleStateContainer changeOpenTo={false} trigger='Hello World' onTriggerClosing={mockOnTriggerClosing} />);
      const trigger = collapsible.find('.Collapsible__trigger');
      
      expect(trigger).toHaveLength(1);
      expect(mockOnTriggerClosing.mock.calls).toHaveLength(0);
    });
  });
})
