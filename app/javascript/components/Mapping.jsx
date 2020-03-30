import React from 'react';
import $ from "jquery";

class Mapping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            OhrElemente: [],
            x: 0, y: 0,
            selectedId: 0
        };

        $.getJSON('/ear_elements')
            .then(response => this.setState({ OhrElemente: response }));
    }

    _onMouseMove(e) {
        this.setState({ x: e.screenX, y: e.screenY });
    }

    selectPng(x, y, len) {
        let canvas = document.getElementById('canvas');
        let context = canvas.getContext('2d');
        for (let i = 0; i < len; i++){
            let myImg = document.getElementById(i);
            context.drawImage(myImg, 0, 0);
            let rect = myImg.getBoundingClientRect();
            let data = context.getImageData(x - rect.left, y - (rect.top+75), 1, 1).data;
            if(data[0] !== 0) {
                this.setState({selectedId: i});
                myImg.style.opacity = '1';
                for (i++; i < len; i++){
                    document.getElementById(i).style.opacity = 0.5;
                }
            } else {myImg.style.opacity = '0.5';}
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    render() {
        const divStyle = {position: 'absolute'};
        const { x, y } = this.state;
        const len = this.state.OhrElemente.length;

        let alleElemente = this.state.OhrElemente.map((elem,index)=>{
            return<div key={index} onClick={this.selectPng.bind(this, x, y, len)}>
                <img src={elem.img} style={divStyle} id={index}/>
            </div>
        });

        return (
            <div onMouseMove={this._onMouseMove.bind(this)}>
                <canvas id='canvas' style={divStyle} width="600" height="530"/>
                {alleElemente}
            </div>
        )
    }
}

export default Mapping;
