import React from "react";
import ResultListItem from "./resultListItem";

const ResultList = props => {
  const resultItems = props.results.map((result, index) => {
    return (
      <ResultListItem
        key={index}
        result={result}
      />
    );
  });

  return <ul>{resultItems}</ul>;
};

export default ResultList;
