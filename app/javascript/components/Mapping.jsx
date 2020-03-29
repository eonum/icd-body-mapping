import React from 'react';
import $ from "jquery";

class Mapping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            OhrElemente: [],
        };

        $.getJSON('/ear_elements')
            .then(response => this.setState({ OhrElemente: response }));
    }

    render() {
        let alleElemente = this.state.OhrElemente.map((elem,index)=>{
            let divStyle = {
                position: 'absolute',
            };
            return<div key={index}>
                <img src={elem.img} style={divStyle}/>
            </div>
        });
        return (
            <div>
                {alleElemente}
            </div>
        )
    }
}

export default Mapping;
