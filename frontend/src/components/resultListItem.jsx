import React from "react";

const URL_FRONT = process.env.REACT_APP_URL_FRONT;

const ResultListItem = ({ result, onResultSelect }) => {
  console.log(result._source)
  const resource_id = result._source.resource_id;
  const dataset_id = result._source.dataset_id;
  const dataset_title = result._source.dataset_title;
  const title = result._source.title;
  var listHeaders = []
  if (result._source.header) {
    listHeaders = result._source.header.map(function(item){ return <span>{item} - </span>});
  }
  console.log(listHeaders);
  return (
    <li className="list-group-item">
      <div className="result-list media">
        <div className="media-body">
          <div className="media-heading">
            <div style={{width: '100%', height: '80px'}}>
              <div style={{float: 'left', width: '90%'}}>
                <h5 className={"mt-0"}>{dataset_title}</h5>
                <h6 className={"mt-0"} style={{fontStyle: "italic"}}>{title}</h6>
              </div>
              <div style={{float: 'left', width: '10%', textAlign: 'right'}}>
                <a href={URL_FRONT+"/resource/"+resource_id} target="_blank" >
                  <button type="button" className="btn btn-info">Inspecter</button>
                </a>
              </div>
            </div>
            Dataset ID : {dataset_id}<br></br>
            Resource ID : {resource_id}<br></br>
            <br></br>
            Check sur datagouv : <a href={"http://data.gouv.fr/datasets/" + dataset_id} target="_blank">http://data.gouv.fr/datasets/{dataset_id}</a>
            <br></br>
          </div>
        </div>
      </div>
    </li>
  );
};

export default ResultListItem;
