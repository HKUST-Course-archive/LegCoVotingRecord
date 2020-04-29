import React from 'react';
import {Link} from 'react-router-dom'
import './Navigation.css';

class Navigation extends React.Component {
    
    render() {
        return (
            <nav>
                <Link to="/home" onClick={() => this.props.setSelect(null)}>Home</Link>
                <Link to='/bills'>List of Bills</Link>
                <Link to='/about'>About</Link>
            </nav>
        )
    }
}

export default Navigation;