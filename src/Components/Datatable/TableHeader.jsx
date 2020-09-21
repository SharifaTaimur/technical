import React, { Component } from "react";

class TableHeader extends Component {
  render() {
    const { headers } = this.props;

    return (
      <thead>
        <tr>
          {headers.map((head) => (
            <th className="clickable" key={head.field}>
              {head.name}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}

export default TableHeader;
