import {configure, setAddon, addDecorator} from '@storybook/react';
import React from 'react';
import JSXAddon from 'storybook-addon-jsx';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
setAddon(JSXAddon);

Enzyme.configure({adapter: new Adapter()});

let req;
if (process.env.TEST_TYPE === 'jest') {
  req = global.__requireContext(__dirname, '../stories', true, /\.stories\.js$/)
} else {
  req = require.context('../stories', true, /\.stories\.js$/)
}

const ErrorDecorator = (storyFn) => (<ErrorBoundary>
  {storyFn()}
</ErrorBoundary>)

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false
    };
  }

  componentDidCatch(error, info) {
    // Display fallback UI
    this.setState({hasError: true});
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <h1>Something went wrong.</h1>;
    }
    return this.props.children;
  }
}

addDecorator(ErrorDecorator);

// NOTE: This is a quick fix which will make mount from
// enzyme work again in the components of storybook so they
// can render, currently the library isn't really maintained,
// so this is the only fix I could come accross 20190923:Alevale
import { specs, describe, it } from 'storybook-addon-specifications';
import { mount } from 'enzyme';
import expect from 'expect';

specs(() => describe('Mock', () => {
  it('Should load the mount functionality from enzyme', () => {
    const wrapped = mount(<div></div>);
    expect(wrapped).toBeTruthy();
  });
}));

function loadStories() {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module);
