import React, { Component } from "react";
import elasticsearch from "elasticsearch";
import Button from '@material-ui/core/Button';
import Tooltip from '@material-ui/core/Tooltip';


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
      codeDepartement: []
    };

    console.log(this.props.match.params.resource_id)
    this.resultSearch(this.props.match.params.resource_id);
    console.log("pour test")

    this.handleEnrich = this.handleEnrich.bind(this);
  }

  handleEnrich(){
    console.log("Coucou")

    fetch('http://backend.dataeng.etalab.studio/enrich', {
        method: "POST",
        contentType: "application/json; charset=utf-8",
        // contentType: "application/x-www-form-urlencoded",
        body: JSON.stringify({
            "dep": this.state.codeDepartement,
        })
    })
        .then(response => console.log(response))
        .catch(err => console.log(err))


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
          this.setState({ myresource: esResults });
          
          let inter = []
          esResults[0]._source.header.forEach(function(head){
            let jsonhead = { head: head.replace(new RegExp("\"", "g"), ''), detect: false}
            inter.push(jsonhead)
          });


  
          if(esResults[0]._source.code_departement !== undefined){
            inter.forEach(function(obj){
              if(obj.head == esResults[0]._source.code_departement[0]){
                obj.detect = true
              }
            })

          }

          this.setState({codeDepartement: inter});

          console.log("State :")
          console.log(this.state)

        },
        error => {
          console.trace(error.message);
        }
      );
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

              <div>Header : {this.state.codeDepartement.map(column => (
                <span>
                  {column.detect ? 
                  <Tooltip title="Il semble que cela soit un code département" placement="top">
                    <button  type="button" className="btn btn-warning">{column.head}</button>
                  </Tooltip>
                  : 
                  <button  type="button" className="btn btn-primary">{column.head}</button>
                  }&nbsp;&nbsp;
                </span>
              ))}</div>
              <br></br>
              <div className="button-quality">
                <button>Voir les ressources similaires</button>  <button onClick={this.handleEnrich} type="button" className="btn btn-info">Enrichir la ressource</button>   <button>Créer un schéma</button>   <button>Analyse Qualité</button>
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
