import React from 'react';

class DetailsCard extends React.Component {
    constructor(props) {
        super(props);
        // retrieve data to be displayed from backend
        this.state = {
            icd: []
        };
    }

    componentDidMount() {

        /*let icdID = {(this.props.icd.id === null) ? 1 : this.props.icd.id}

        const url = `/icds/${icdID}`;

        fetch(url)
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error("Network response wasn't ok.");
            })
            .then(response => this.setState({ icd: response }))
            .catch(() => this.props.history.push("/icds"));

         */
    }

    render() {
        /*
        let { icd } = this.state;

        const selectedIcd = icd.map((icd, index) => (
            <div key={index}>
                <p>{icd.code}</p>
            </div>
        ));
        const noIcd = (
            <div className="vw-100 vh-50 d-flex align-items-center justify-content-center">
                <h4>
                    Icd's haven't loaded yet
                </h4>
            </div>
        );

        return (
            <div>
                {icd.length > 0 ? selectedIcd : noIcd}
            </div>
        )

         */

        return (
            <p><span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aperiam fuga fugit quidem. Accusantium aspernatur autem commodi ducimus fugit in inventore iste, neque omnis quaerat quibusdam similique suscipit tempore vel velit!</span><span>Aspernatur cumque quos sapiente. Corporis dolorum iusto nostrum officiis unde! Dolorum ex explicabo ipsa, non nulla recusandae rem! Adipisci autem cumque in, laboriosam mollitia nostrum odit quae quam repellendus tenetur.</span><span>Culpa dignissimos excepturi incidunt itaque mollitia officia reprehenderit sed sequi ut. A aliquam aliquid cumque, cupiditate doloremque fugiat in itaque libero mollitia neque pariatur, provident quasi reprehenderit saepe sapiente similique!</span><span>Amet architecto at aut, commodi consectetur consequuntur, cum dolore dolorum ea eos error et exercitationem facere labore laborum magni nam necessitatibus porro quaerat quo reiciendis rem repellendus reprehenderit, totam voluptatibus!</span><span>Accusantium laborum mollitia nemo non possimus veniam voluptatem? Accusantium assumenda at atque dicta dolorem doloribus ea earum est illo illum iure iusto, nulla pariatur quis quo reiciendis rerum unde voluptate?</span></p>
        )
    }
}

export default DetailsCard;
