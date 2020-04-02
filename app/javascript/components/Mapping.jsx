import React from 'react';
import $ from "jquery";

class Mapping extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            imageElements: [],
            layers: [],
            activeLayer: '',
            x: 0, y: 0,
            selectedId: 0
        };

        $.getJSON('/layers/Ohr')
            .then(response => this.setState({ imageElements: response }));

        $.getJSON('/layers')
            .then(response => this.setState({ layers: response }));
    }

    _onMouseMove(e) {
        this.setState({ x: e.screenX, y: e.screenY });
    }

    selectLayer(elem){
        $.getJSON('/layers/' + elem.ebene)
            .then(response => this.setState({ imageElements: response }));
        this.setState({
            activeLayer: elem.ebene
        })
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
        const len = this.state.imageElements.length;

        let alleElemente = this.state.imageElements.map((elem,index)=>{
            return<div key={index} onClick={this.selectPng.bind(this, x, y, len)}>
                <img src={elem.img} style={divStyle} id={index}/>
            </div>
        });

        let alleLayers = this.state.layers.map((elem,index)=>{
            return<div className="dropdown-item" key={index} onClick={this.selectLayer.bind(this, elem)}>
                {elem.ebene}
            </div>
        });

        const dropdown = (
            <div className="col-2 dropdown">
                <button className="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    Layer
                </button>
                <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    {alleLayers}
                </div>
            </div>
        )

        const activeLayer = (
            <div className="col-10">
                <h4>
                    {this.state.activeLayer}
                </h4>
            </div>
        )

        return (
            <div onMouseMove={this._onMouseMove.bind(this)}>
                <canvas id='canvas' style={divStyle} width="600" height="530"/>
                <div className="row">
                    {dropdown}
                    {activeLayer}
                </div>
                <div className="row pt-2">
                    {alleElemente}
                </div>
            </div>
        )
    }
}

export default Mapping;
