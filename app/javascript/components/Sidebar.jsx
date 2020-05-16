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
        this.ICDsInCurrentChapter = [];
        this.ICDstack = [];
        this.state = {
            icdSelection: [],
            filtered: false,
            icdCodelength: 3,
            hierarchyEnd: false,
            chapterArray: [],
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

    componentDidUpdate(prevProps) {
        if (this.props.needUpdate !== prevProps.needUpdate) {
            this.setState({
                filtered: false,
                icdCodeLength: 3,
                hierarchyEnd: false
            });
        }
        if (this.props.reloadIcds !== prevProps.reloadIcds) {
            this.loadIcds();
        }
        if (this.props.selectedIcd !== prevProps.selectedIcd
            && this.props.selectedIcd !== ''
            && this.props.icdSelectionFromSearch === true) {
            this.ICDstack = [this.chapterICDs];
            this.setState({
                icdSelection: this.allICDs,
            });
            this.filterIcdsByChapter(this.props.selectedIcd);
            const fullCode = this.props.selectedIcd.code.toString();
            const codeSplit = fullCode.split('.');
            const codeMain = codeSplit[0];
            this.filterIcdsByIcdcode(codeMain);
            if (codeSplit.length === 2) {
                const subCode = codeSplit[1];
                let subCodeSplit;
                let i = 1;
                let code;
                while (i < (subCode.length+1)) {
                    subCodeSplit = subCode.substring(0, i);
                    code = codeMain + '.' + subCodeSplit;

                    if (subCodeSplit === subCode) {
                        this.filterIcdsByIcdcode(code, this.props.selectedIcd);
                    } else {
                        this.filterIcdsByIcdcode(code);
                    }
                    i++;
                }
            } else if (codeSplit.length === 1) {} else {
                alert('unexpected code structure. ICD code should be of form ***, ***.* or ***.** and have a maximal length of 6 characters.');
            }
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

        this.ICDstack.push(this.chapterICDs);
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
        selection = selection.sort();

        this.ICDsInCurrentChapter = selection;

        selection = this.ICDsInCurrentChapter.map((icd) => {
            if (icd.code.toString().length === codelength) {
                return icd;
            } else {
                return 0;
            }
        });
        selection = selection.filter((value) => {
            return value !== 0;
        });
        selection = selection.sort();
        this.ICDstack.push(selection);

        this.setState({
            icdSelection: selection,
            filtered: true,
            icdCodelength: codelength,
        });
    }

    /**
     * Filters ICD's according to the code of a given ICD
     * and stores the filtered and sorted array in the state
     * @param code
     * @param icd
     */
    filterIcdsByIcdcode(code, icd = '') {
        const ICDs = this.ICDsInCurrentChapter;
        let icdCode = code.toString();
        const maxCodelength = 6;
        let codelength = icdCode.length + 1;
        let selection;

        do {
            selection = ICDs.map((icd) => {
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

            codelength++;
        } while (selection.length === 0
                && codelength <= maxCodelength
                && codelength >= 0)

        selection = selection.sort();

        if (selection.length !== 0) {
            this.setState({
                icdSelection: selection,
                filtered: true,
                icdCodelength: codelength,
                hierarchyEnd: false
            });
            this.ICDstack.push(selection);
            console.log(this.ICDstack);
        } else {
            this.setState({
                filtered: true,
                icdCodelength: icdCode.length,
                hierarchyEnd: true,
            });
        }
        if (icd !== '') {
            this.sendIcdToMainUI(icd);
        }
    }

    /**
     * Gets ICD's from next superior level in hierarchy via ICDstack
     */
    stepBackHierarchyStack() {
        this.ICDstack.pop();
        let selection = [];
        let filtered = true;
        let firstICD = '';
        let codelength = 3;

        if (this.ICDstack.length > 1) {
            selection = this.ICDstack[this.ICDstack.length-1];
            firstICD = selection[0];
            codelength = firstICD.code.toString().length;
        } else {
            filtered = false;
        }

        this.setState({
            icdSelection: selection,
            filtered: filtered,
            icdCodelength: codelength,
            hierarchyEnd: false
        });
    }

    /**
     * Sends selected ICD to parent MainUI
     * (which itself sends it to DetailsCard)
     * @param icd
     */
    sendIcdToMainUI(icd) {
        this.props.callbackFromMainUI(icd);
    }

    render() {
        const { icdSelection } = this.state;

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
        let icdSubGroup = [];
        if (icdSelection !== []) {
            icdSubGroup = icdSelection.map((icd, index) => {
                return <div className="list-group mr-1" key={index}>
                    <button
                        type="button"
                        className="list-group-item list-group-item-action p-0 pl-2"
                        onClick={this.filterIcdsByIcdcode.bind(this, icd.code, icd)}
                    >
                        {icd.code}
                    </button>
                </div>
          });
        }

        const empty = (
            <></>
        );
        const backButton = (
            <a type="button"
               className="btn btn-light mb-1"
               onClick={this.stepBackHierarchyStack.bind(this)}
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
                {this.ICDstack.length > 0 ? empty : loadingImg}
                <div>
                    {this.ICDstack.length > 1 && this.state.filtered === true ? backButton : empty}
                </div>
                <div style={this.state.filtered ? withBackButtonStyle : withoutBackButtonStyle}>
                    {this.ICDstack.length > 0 ? empty : whileLoading}
                    {this.ICDstack.length === 1 && this.state.filtered === false ? icdChapters : empty}
                    {this.ICDstack.length > 1 && this.state.filtered === true ? icdSubGroup : empty}
                </div>
            </div>
        )
    }
}

export default Sidebar;
