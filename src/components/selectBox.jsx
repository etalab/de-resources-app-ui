import React, { Component } from "react";

class SelectBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      term: ""
    };
  }

  onInputChange(term) {
    this.setState({ term });
    this.props.onSearchTermChange(term);
  }

  render() {
    return (
      <div className="select-box">



        <form onChange={event => this.onInputChange(event.target.value)}>
            <select>
                <option selected value="">Non spécifié</option>
                <option value="siret">Siret</option>
                <option value="siren">Siren</option>
                <option value="code_commune_insee">Code Commune</option>
                <option value="code_departement">Code Département</option>
                <option value="code_region">Code Région</option>
                <option value="departement">Département</option>
                <option value="region">Région</option>
                <option value="email">Email</option>
                <option value="code_rna">Code RNA</option>
                <option value="longitude_wgs">Longitude</option>
                <option value="latitude_wgs">Latitude</option>
                <option value="jour_de_la_semaine">Jour de la semaine</option>
            </select>
        </form>
      </div>
    );
  }
}

export default SelectBox;
