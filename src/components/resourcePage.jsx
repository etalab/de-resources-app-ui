import React, { Component } from "react";
import elasticsearch from "elasticsearch";
import _ from "lodash";

const ELK_SECRET = process.env.REACT_APP_ELK_SECRET;
const ELK_URL = process.env.REACT_APP_ELK_URL;


let client = new elasticsearch.Client({ host: ELK_URL, httpAuth: ELK_SECRET, log: "error" });

const searchSize = 1;

class ResourcePage extends Component {
  constructor(props) {
    super(props);
    this.resultSearch = this.resultSearch.bind(this);

    this.state = {
      myresource: [],
      tutu: [{'toto':'tutu'}],
      some: ""
    };

    console.log(this.props.match.params.resource_id)
    this.resultSearch(this.props.match.params.resource_id);
    console.log("pour test")
  }

  resultSearch(myid){
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

    let bodysearch = {
      query: {
        match: {
          resource_id: myid
        }
      }
    }

    //client.search({ index: "csvresource", q: term, size: searchSize }).then(
      client.search({ index: "csvresource", body:bodysearch, size: searchSize }).then(
        body => {
          let esResults = body.hits.hits;
          console.log(body.hits.hits[0])
          this.setState({ myresource: esResults });
        },
        error => {
          console.trace(error.message);
        }
      );
  
      console.log(this.state)
  }

  render() {
    return (
      <div>
        <div>
          {this.state.myresource.map(resource => (
            <div>
              <div className="title-dataset">{resource._source.dataset_title}</div>
              <div className="title-resource">Resource : {resource._source.title}</div>
              <br></br><br></br>
              <div>Header : {resource._source.header.map(hihi => (<span>{hihi} ; </span>))}</div>
              <br></br>
              <div className="button-quality">
                <button>Voir les ressources similaires</button>  <button>Enrichir la ressource</button>   <button>Créer un schéma</button>   <button>Analyse Qualité</button>
              </div>
              <br></br><br></br>
              Aperçu des données :
              <br></br>
              <div><iframe src={"https://www.data.gouv.fr/tabular/preview/?url="+resource._source.resource_url} width="100%" height="1000"></iframe></div>
              
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ResourcePage;
