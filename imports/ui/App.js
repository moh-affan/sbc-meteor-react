import React, {Component} from 'react';
import Header from './containers/Header';
import Sidemenu from './containers/Sidemenu';

export default class App extends Component {
    render() {
        return (
            <div className='body'>
                <Header />
                <div className="wrapper row-offcanvas row-offcanvas-left">
                    <Sidemenu />
                </div>
            </div>
        );
    }
}