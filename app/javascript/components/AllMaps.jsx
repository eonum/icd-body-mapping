import $ from "jquery";
import React from "react";

class AllMaps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            maps: []
        };
        this.handleDelete = this.handleDelete.bind(this)
        this.deleteMap = this.deleteMap.bind(this)
    }

    componentDidUpdate(prevProps) {
        if(this.props.showingIcdId !== prevProps.showingIcdId)
        {
            if (this.props.showingIcdId !== 0){
                $.getJSON('/api/v1/map/' + this.props.showingIcdId)
                    .then(response => this.setState({maps: response}));
            }
        }
    }

    handleDelete(map_id){
        fetch(`http://localhost:3000/api/v1/maps/${map_id}`,
            {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json'}
            }).then((response) => {
            this.deleteMap(map_id)
        })
    }

    deleteMap(map_id){
        let newMaps = this.state.maps.filter((map) => map.map_id !== map_id)
        this.setState({
            maps: newMaps
        })
    }

    render() {
        let maps = this.state.maps.map((elem, index) => {
            return(
                <div key={index}>
                    {elem.name}
                    <button onClick={() => this.handleDelete(elem.map_id)} style={{float: 'right'}}>
                        X
                    </button>
                </div>
            )
        });
        let allMaps = (
            <div className="card">
                {maps}
            </div>
        );
        const empty = (<div/>);

        return(
            <div>
                {(this.state.maps.length === 0) ? empty : allMaps}
            </div>
        );
    }
}
export default AllMaps