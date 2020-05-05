import React from 'react';
import {IconButton} from '@material-ui/core';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import loadingGif from '../../assets/images/Preloader_2.gif'

/**
 * The Sidebar gets the database from backend and renders
 * the ICD's according to the hierarchy of the ICD catalogue
 * @author Aaron Saegesser
 */
class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.allICDs = [];
        this.chapterICDs = [];
        this.state = {
            icds: [],
            icdSelection: [],
            filtered: false,
            icdCodelength: 3,
            term: '',
            hierarchyEnd: false,
            chapterArray: []
        };
    }

    componentDidMount() {
        let chapterArray = [];
        for (var i=1; i<23; i++) {
            chapterArray.push({index: i});
        }
        this.setState({
            chapterArray: chapterArray
        });

        this.loadIcds();
    }

    /** Reset UI
     *
     */

    componentDidUpdate(prevProps) {
        if (this.props.needUpdate !== prevProps.needUpdate) {
            this.setState( {
                filtered: false,
                icdCodeLength: 3,
                term: '',
                hierarchyEnd: false
            });
        }
        if (this.props.reloadIcds !== prevProps.reloadIcds) {
            this.loadIcds();
        }
        if (this.props.selectedIcd !== prevProps.selectedIcd && this.props.selectedIcd !== '') {
            this.setState({
                icds: this.allICDs,
                term: this.props.selectedIcd.code,
            });
            this.filterIcdsByChapter(this.props.selectedIcd);
            this.filterIcdsByIcdcode(this.state, this.props.selectedIcd);
        }
    }

    loadIcds() {
      const url = "/api/v1/icds";
      fetch(url)
          .then(response => {
              if (response.ok) {
                  return response.json();
              }
              throw new Error("Network response wasn't ok.");
          })
          .then(async response => this.storeDatabase(await response))
          .catch(() => this.props.history.push("/"));
    }

    /**
     * Takes backend response and calls methods to store the DB
     * in the frontend for further processing
     * @param response
     */
    storeDatabase(response) {
        this.setState({ icds: response.sort() });
        this.setIcdDatabaseStorage(response);
        this.readOutChapters(response);
    }

    setIcdDatabaseStorage(icds) {
        this.allICDs = icds;
    }

    /**
     * Reads and stores first ICD of every chapter
     * (which will then be used by renderer to display the chapters)
     * @param icds
     */
    readOutChapters(icds) {
        let chapterTemp;
        this.chapterICDs = icds.map((icd) => {
            if (icd.kapitel !== chapterTemp) {
                chapterTemp = icd.kapitel;
                return icd;
            } else {
                return 0;
            }
        });

        this.chapterICDs = this.chapterICDs.filter((value) => {
            return value !== 0;
        });

        this.chapterICDs.sort((icd1, icd2) => {
            const chap1 = icd1.kapitel;
            const chap2 = icd2.kapitel;

            let comparison = 0;
            if (chap1 > chap2) {
                comparison = 1;
            } else if (chap1 < chap2) {
                comparison = -1;
            }
            return comparison;
        });

        this.setState({
            icdSelection: this.chapterICDs
        });
    }

    /**
     * Filters ICD's according to the chapter of a given ICD
     * and stores the matching cases in a sorted array in the state
     * @param icd
     */
    filterIcdsByChapter(icd) {
        const ICDs = this.allICDs;
        const selectedChapter = icd.kapitel;
        const codelength = 3;

        let selection = ICDs.map((icd) => {
            if (icd.kapitel === selectedChapter) {
                return icd;
            } else {
                return 0;
            }
        });

        selection = selection.filter((value) => {
            return value !== 0;
        });

        this.setState({
            icds: selection.sort(),
            filtered: true,
            icdCodelength: codelength,
        });
    }

    /**
     * Filters ICD's according to the code of a given ICD
     * and stores the filtered and sorted array in the state
     * @param state
     * @param icd
     */
    filterIcdsByIcdcode(state, icd) {
      const ICDs = state.icds;
      const icdCode = icd.code.toString();
      let codelength;

      switch (icdCode.length) {
          case 1:
              codelength = 3;
              break;
          case 3:
              codelength = 5;
              break;
          case 5:
              codelength = 6;
              break;
      }

      let selection = ICDs.map((icd) => {
          if (icd.code.toString().includes(icdCode)
              && icd.code.toString().length === codelength) {
              return icd;
          } else {
              return 0;
          }
      });

      selection = selection.filter((value) => {
          return value !== 0;
      });

      if (selection.length !== 0) {
          this.setState({
              icdSelection: selection.sort(),
              filtered: true,
              icdCodelength: codelength,
              term: icdCode,
              hierarchyEnd: false
          });
      } else {
          this.setState({
              filtered: true,
              hierarchyEnd: true
          });
      }

      this.sendIcdToMainUI(icd);
    }

    /**
     * Gets ICD's from next superior level in hierarchy via shortening
     * the search term and searching the ICD's array
     */
    stepBackHierarchy() {
        const state = this.state;
        let ICDs = state.icds;

        let term = state.term;
        let filtered = true;
        let codelength;

        if (term.toString().length === 0) {
            ICDs = this.allICDs;
            filtered = false;
            codelength = 3;
        } else if (term.toString().length === 3) {
            term = '';
            codelength = 3;
        } else if (term.toString().length === 5) {
            term = term.toString().substring(0, 3);
            codelength = 5;
        } else if (term.toString().length === 6) {
            term = term.toString().substring(0, 5);
            codelength = 6;
        }

        let selection = ICDs.map((icd) => {
            if (icd.code.toString().includes(term)
                && icd.code.toString().length === codelength) {
                return icd;
            } else {
                return 0;
            }
        });

        selection = selection.filter((value) => {
            return value !== 0;
        });

        this.setState({
            icdSelection: selection.sort(),
            filtered: filtered,
            icdCodelength: codelength,
            term: term
        });
    }

    /**
     * Sends selected ICD to parent MainUI
     * (which itself sends it to DetailsCard)
     * @param icd_id
     */
    sendIcdToMainUI(icd) {
        this.props.callbackFromMainUI(icd);
    }

    render() {
        const { icds } = this.state;

        const withBackButtonStyle = {
            height: '82vh',
            overflow: 'auto'
        }
        const withoutBackButtonStyle = {
            height: '86vh',
            overflow: 'auto'
        }

        const chapterArray = this.state.chapterArray;
        const whileLoading = chapterArray.map((chapter) => {
            return <div className="list-group mr-1" key={chapter.index}>
                <button
                    type="button"
                    className="list-group-item list-group-item-action p-0 pl-2"
                    disabled
                >
                    {chapter.index}
                </button>
            </div>
        });
        const icdChapters = this.chapterICDs.map((icd, index) => {
            return <div className="list-group mr-1" key={index}>
                <button
                    type="button"
                    className="list-group-item list-group-item-action p-0 pl-2"
                    onClick={this.filterIcdsByChapter.bind(this, icd)}
                >
                    {icd.kapitel}
                </button>
            </div>
        });
        const icdSubGroup = icds.map((icd, index) => {
            if (icd.code.toString().includes(this.state.term)
                && icd.code.toString() !== this.state.term
                && icd.code.toString().length === this.state.icdCodelength
                && this.state.hierarchyEnd === false) {
                return <div className="list-group mr-1" key={index}>
                    <button
                        type="button"
                        className="list-group-item list-group-item-action p-0 pl-2"
                        onClick={this.filterIcdsByIcdcode.bind(this, this.state, icd)}
                    >
                        {icd.code}
                    </button>
                </div>
            } else if (icd.code.toString().includes(this.state.term)
                && icd.code.toString() !== this.state.term
                && icd.code.toString().length === this.state.icdCodelength
                && this.state.hierarchyEnd === true) {
                return <div className="list-group mr-1" key={index}>
                    <button
                        type="button"
                        className="list-group-item list-group-item-action p-0 pl-2"
                        onClick={this.filterIcdsByIcdcode.bind(this, this.state, icd)}
                    >
                        {icd.code}
                    </button>
                </div>
            }
        });
        const empty = (
            <></>
        );
        const backButton = (
            <a type="button"
               className="btn btn-light"
               onClick={this.stepBackHierarchy.bind(this, this.state)}
            >
                <ArrowBackIcon/>
            </a>
        );
        const loadingImgStyle = {
            zIndex: 100,
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '50px',
            height: '50px',
            marginTop: '-25px',
            marginLeft: '-25px',
        }
        const loadingDivStyle = {
            zIndex: 99,
            top: '0%',
            left: '0%',
            height: '100%',
            width: '100%',
            position: 'absolute',
            height: '88vh',
            backgroundColor: 'rgba(255,255,255,0.7)',
        }
        const loadingImg = (
            <div style={loadingDivStyle}>
                <img src={loadingGif} style={loadingImgStyle}/>
            </div>
        )

        return (
            <div>
                {icds.length > 0 ? empty : loadingImg}
                <div className="mb-1">
                    {icds.length > 0 && this.state.filtered === true ? backButton : empty}
                </div>
                <div style={this.state.filtered ? withBackButtonStyle : withoutBackButtonStyle}>
                    {icds.length > 0 ? empty : whileLoading}
                    {icds.length > 0 && this.state.filtered === false ? icdChapters : empty}
                    {icds.length > 0 && this.state.filtered === true ? icdSubGroup : empty}
                </div>
            </div>
        )
    }
}

export default Sidebar;
