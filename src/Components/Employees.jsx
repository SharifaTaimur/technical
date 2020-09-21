import React, { Component } from "react";
import axios from "axios";
import Pagination from "./Datatable/Pagination";
import Search from "./Datatable/Search";
import _ from "lodash";
import "@formatjs/intl-datetimeformat/add-all-tz";
import SummaryCard from "./SummaryCard";
import paginate from "./utils/paginate";

class DataTable extends Component {
  state = {
    users: [],
    currentPage: 1,
    pageSize: 5,
    searchQuery: "",
    currentSort: "down",
  };

  header = [
    { name: "", field: "id", sortable: false },
    { name: "Name", field: "name", sortable: true },
    { name: "Email", field: "email", sortable: true },
    { name: "CreatedOn", field: "created_at", sortable: true },
  ];

  sortTypes = {
    up: {
      class: "sort-asc",
      fn: (a, b) => new Date(a.created_at) - new Date(b.created_at),
    },
    down: {
      class: "sort-desc",
      fn: (a, b) => new Date(b.created_at) - new Date(a.created_at),
    },
  };

  getUsers() {
    axios
      .get("http://localhost:3000/example_data.json")
      .then((response) => {
        this.setState({ users: response.data });
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  componentDidMount() {
    this.getUsers();
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  onSortChange = () => {
    const { currentSort } = this.state;
    let nextSort;

    if (currentSort === "down") nextSort = "up";
    else if (currentSort === "up") nextSort = "down";
    // else if (currentSort === "default") nextSort = "down";

    this.setState({
      currentSort: nextSort,
    });
  };

  render() {
    const {
      users,
      pageSize,
      currentPage,
      searchQuery,
      sortColumn,
      currentSort,
    } = this.state;

    //Filtering
    let filtered = users;
    if (searchQuery)
      filtered = users.filter(
        (user) =>
          user.name.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
          user.email.toLowerCase().startsWith(searchQuery.toLowerCase())
      );

    //Sort
    const sorted = filtered.sort(this.sortTypes[currentSort].fn);

    //Pagination
    const newUsers = paginate(sorted, currentPage, pageSize);

    return (
      <div>
        {users.length > 0 && (
          <React.Fragment>
            <SummaryCard
              data={users}
              totalmembers={users.length}
              lastadded={filtered}
            />
            <br />
            <hr />
            <h2>Team List</h2>
            <div className="row w-100">
              <div className="col mb-3 col-12 text-center">
                <div className="row">
                  <div className="col-md-6"></div>
                  <div className="col-md-6 d-flex flex-row-reverse">
                    <Search value={searchQuery} onChange={this.handleSearch} />
                  </div>
                </div>
              </div>
            </div>

            <table className="table table-striped bordered table-dark">
              <thead>
                <tr>
                  {this.header.map((item) =>
                    item.name === "CreatedOn" ? (
                      <th
                        className="clickable"
                        key={item.field}
                        onClick={this.onSortChange}
                      >
                        {item.name}

                        <i
                          className={`fa fa-${this.sortTypes[currentSort].class}`}
                        />
                      </th>
                    ) : (
                      <th
                        className="clickable"
                        key={item.field}
                        onClick={this.onSortChange}
                      >
                        {item.name}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {newUsers.map((user) => {
                  return (
                    <tr key={user.id}>
                      <th scope="row">
                        <img
                          alt={user.name}
                          height={100}
                          src={user.cached_avatar}
                          style={{ borderRadius: "60%" }}
                        />
                      </th>
                      <th>{user.name}</th>
                      <th>{user.email}</th>
                      <th>
                        {new Intl.DateTimeFormat("en-GB", {
                          year: "numeric",
                          month: "long",
                          day: "2-digit",
                        }).format(Date.parse(user.created_at))}
                      </th>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="pagination">
              <Pagination
                itemsCount={filtered.length}
                pageSize={pageSize}
                onPageChange={this.handlePageChange}
                currentPage={currentPage}
              />
            </div>
          </React.Fragment>
        )}
      </div>
    );
  }
}

export default DataTable;
