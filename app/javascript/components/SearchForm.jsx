import * as React from "react";



var SearchForm = React.createClass({
    SearchResults: function() {
        var query = ReactDOM.findDOMNode(this.refs.query).value;
        var self = this;
        $.ajax({
            url: '/api/events/search',
            data: { query: query },
            success: function(data) {
                self.props.SearchResults(data);
            },
            error: function(xhr, status, error) {
                alert('Search error: ', status, xhr, error);
            }
        });
    },
    render: function() {
        return(
            <input onChange={this.getSearchResults}
                   type="text"
                   className="form-control"
                   placeholder="Type search phrase here..."
                   ref="query" />
        )
    }
});