import _ from "lodash";
import React, { Component } from "react";
import elasticsearch from "elasticsearch";
import SearchBar from "./searchBar";
import SelectBox from "./selectBox";
import ResultList from "./resultList";

const ELK_SECRET = process.env.REACT_APP_ELK_SECRET;
const ELK_URL = process.env.REACT_APP_ELK_URL;

let client = new elasticsearch.Client({ host: ELK_URL, httpAuth: ELK_SECRET, log: "error" });

const searchSize = 100;

class SearchPage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: [],
      selectedResult: null,
      headerValue: "",
      columnsTypes: "",
      anywhereValue: "",
      nbResults: null
    };

    this.eSearch("");

    this.handleButton = this.handleButton.bind(this);

  }

  handleButton(){
    //alert("oooo")
  }

  eSearch(anywhereVal, headerVal, colVal) {
    // pin client
    client.ping(
      {
        requestTimeout: 10000
      },
      function(error) {
        if (error) {
          console.error("elasticsearch cluster is down!");
        } else {
          console.log("successfully connected to elasticsearch cluster");
        }
      }
    );
    // search for term



    let bodysearch = {}

    if(anywhereVal !== undefined && anywhereVal !== ""){
      if(headerVal !== undefined && headerVal !== ""){
        if(colVal !== undefined && colVal !== ""){
          this.setState({ results: []})
          //3 remplis
          bodysearch = {
            query: {
              bool: {
                must: [
                {
                  fuzzy:{                   
                    header: {
                      value: headerVal
                    } 
                  }
                },
                {
                  term: { columns_types: colVal }
                }, 
                {
                  multi_match:{
                    query: anywhereVal,
                    fields: [ "dataset_title", "title" ],
                    fuzziness: "auto"
                  }
                }]
              }
            }
          }
        }
        
        else{
          //any + head
          bodysearch = {
            query: {
              bool: {
                must: [
                {
                  fuzzy:{                   
                    header: {
                      value: headerVal
                    } 
                  }
                },
                {
                  multi_match:{
                    query: anywhereVal,
                    fields: [ "dataset_title", "title" ],
                    fuzziness: "auto"
                  }
                }]
              }
            }
          }


        }
      }else{
        if(colVal !== undefined && colVal !== ""){
          //any + col
          bodysearch = {
            query: {
              bool: {
                must: [
                {
                  term: { columns_types: colVal }
                }, 
                {
                  multi_match:{
                    query: anywhereVal,
                    fields: [ "dataset_title", "title" ],
                    fuzziness: "auto"
                  }
                }]
              }
            }
          }
        }else{
          //any
          bodysearch = {
            query: {
              bool: {
                must: [ 
                {
                  multi_match:{
                    query: anywhereVal,
                    fields: [ "dataset_title", "title" ],
                    fuzziness: "auto"
                  }
                }]
              }
            }
          }
        }
      }
    }else{
      if(headerVal !== undefined && headerVal !== ""){
        if(colVal !== undefined && colVal !== ""){
          //head + col
          bodysearch = {
            query: {
              bool: {
                must: {
                  match:{
                    header: headerVal
                  }
                },
                filter: {
                  term: {
                    columns_types: colVal
                  }
                }
              }
            }
          }
        }else{
          //head
          bodysearch = {
            query: {
              fuzzy: {
                  header: {
                    value: headerVal
                  }
              }
            }
          }
        }
      }else{
        if(colVal !== undefined && colVal !== ""){
          //col
          bodysearch = {
            query: {
              match: {
                columns_types: colVal
              }
            }
          }
        }else{
          //nothing
          bodysearch = {
            query: {
            }
          }
          this.setState({ results: [], nbResults: null})
        }
      }
    }

    this.state.anywhereValue = anywhereVal;
    this.state.headerValue = headerVal;
    this.state.columnsTypes = colVal;

    //client.search({ index: "csvresource", q: term, size: searchSize }).then(
    client.search({ index: "csvresource", body:bodysearch, size: searchSize }).then(
      body => {
        let esResults = body.hits.hits;
        let nbResults = body.hits.total.value;
        this.setState({ results: esResults, selectedResult: esResults[0], nbResults: nbResults });
      },
      error => {
        console.trace(error.message);
      }
    );
  }

  render() {
    const eSearch = _.debounce(term => {
      this.eSearch(term,this.state.headerValue, this.state.columnsTypes);
    }, 300);

    const eSearch2 = _.debounce(term => {
      this.eSearch(this.state.anywhereValue,term,this.state.columnsTypes);
    }, 300);

    const eSearch3 = _.debounce(term => {
      this.eSearch(this.state.anywhereValue, this.state.headerValue, term);
    }, 300);

    return (
      <div>
        <div className="search-space">
          <div className="everywhere-search"><SearchBar onSearchTermChange={eSearch} /></div>
          <div className="advanced-label">Recherche avancée</div>
          <div className="sub-search-panel">
            <div className="header-label">Headers :</div>
            <div className="header-search"><SearchBar onSearchTermChange={eSearch2} /></div>
            <div className="coltypes-label">Columns Types :</div>
            <div className="coltypes-search"><SelectBox onSearchTermChange={eSearch3} /></div>
          </div>
        </div>
        <div className="nb-results">{this.state.nbResults} Résultats</div>
        <ResultList
          results={this.state.results}
        />
      </div>
    );
  }
}

export default SearchPage; 