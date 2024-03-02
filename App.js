import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [],
      currentPage: 1,
      recordsPerPage: 20,
      searchQuery: '',
      sortBy: 'date',
      sortOrder: 'asc'
    };
    this.handleSearch = this.handleSearch.bind(this);
    this.handleSort = this.handleSort.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    axios.get("http://localhost:5000/customers").then(response => {
      this.setState({ data: response.data.reverse() }); // Reverse the data to display the first 20 records
    });
  }

  handleSearch(event) {
    this.setState({ searchQuery: event.target.value });
  }

  handleSort(sortBy) {
    this.setState(prevState => ({
      sortBy: sortBy,
      sortOrder: prevState.sortOrder === 'asc' ? 'desc' : 'asc'
    }));
  }

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id)
    });
  }

  renderTableData() {
    const { data, currentPage, recordsPerPage, searchQuery, sortBy, sortOrder } = this.state;
    const indexOfFirstRecord = (currentPage - 1) * recordsPerPage;
    const indexOfLastRecord = indexOfFirstRecord + recordsPerPage;
    const filteredData = data.filter(item =>
      item.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase())
    );
    const sortedData = filteredData.sort((a, b) => {
      const keyA = sortBy === 'date' ? new Date(a.created_at) : a.created_at.split('T')[1];
      const keyB = sortBy === 'date' ? new Date(b.created_at) : b.created_at.split('T')[1];
      if (sortOrder === 'asc') {
        return keyA > keyB ? 1 : -1;
      } else {
        return keyA < keyB ? 1 : -1;
      }
    });
    const currentRecords = sortedData.slice(indexOfFirstRecord, indexOfLastRecord);

    return currentRecords.map((result, index) => {
      const { sno, customer_name, age, phone, location, created_at } = result;
      const date = new Date(created_at);
      const formattedDate = date.toLocaleDateString();
      const formattedTime = date.toLocaleTimeString();
      return (
        <tr key={sno}>
          <td>{sno}</td>
          <td>{customer_name}</td>
          <td>{age}</td>
          <td>{phone}</td>
          <td>{location}</td>
          <td>{formattedDate}</td>
          <td>{formattedTime}</td>
        </tr>
      );
    });
  }

  renderPagination() {
    const { data, currentPage, recordsPerPage } = this.state;
    const pageNumbers = [];
    for (let i = 1; i <= Math.ceil(data.length / recordsPerPage); i++) {
      pageNumbers.push(i);
    }
    return (
      <ul className="pagination">
        {pageNumbers.map(number => (
          <li key={number} id={number} onClick={this.handleClick} className={currentPage === number ? "page-item active" : "page-item"}>
            <span className="page-link">{number}</span>
          </li>
        ))}
      </ul>
    );
  }

  render() {
    return (
      <div className="container p-5 App">
        <h1 className="text-center pb-5 border-bottom mb-5">Reactjs Showing PostgreSQL Data Using NodeJS Express WEB API</h1>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by name or location"
            onChange={this.handleSearch}
          />
        </div>
        <table className="table table-hover table-bordered">
          <thead>
            <tr>
              <th scope="col">SNO</th>
              <th scope="col" onClick={() => this.handleSort('name')} style={{ cursor: 'pointer' }}>Customer Name</th>
              <th scope="col">Age</th>
              <th scope="col">Phone</th>
              <th scope="col" onClick={() => this.handleSort('location')} style={{ cursor: 'pointer' }}>Location</th>
              <th scope="col" onClick={() => this.handleSort('date')} style={{ cursor: 'pointer' }}>Date</th>
              <th scope="col">Time</th>
            </tr>
          </thead>
          <tbody>
            {this.renderTableData()}
          </tbody>
        </table>
        {this.renderPagination()}
      </div>
    );
  }
}

export default App;
