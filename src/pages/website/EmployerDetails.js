import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import PaginationComponent from 'components/PaginationComponents';
import { Card, Col, Container, Row } from "react-bootstrap";
import Loader from "components/Loader";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const columns = [
  { name: "S.No", selector: (row) => row?.serialNumber, sortable: true, width: "100px" },
  { name: "Name", selector: (row) => row?.name, sortable: true, width: "200px" },
  { name: "Email", selector: (row) => row?.email, sortable: true, width: "200px" },
  { name: "Mobile No", selector: (row) => row?.mobileNo, sortable: true, width: "200px" },
  { name: "Company Name", selector: (row) => row?.companyName, sortable: true, width: "200px" },
  { name: "Designation", selector: (row) => row?.designation, sortable: true, width: "200px" },
  { name: "Package Name", selector: (row) => row?.packageName, sortable: true, width: "200px" }
];

export const EmployerDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [employerDetails, setEmployerDetails] = useState([]);
  const [newSearchTerm, setNewSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // const fetchdata = useCallback(async () => {
  //   const response = await axios.get(`${BASE_API_URL}employer-details/get-all/employer/details`);
  //   if (response?.data?.result === true) {
  //     setEmployerDetails(response.data.data);
  //     setOriginalData(response.data.data)
  //     response.data.data.forEach((item, index) => {
  //       item.serialNumber = index + 1;
  //   });
  //     setIsLoading(false);
  //   }
  // }, []);

  const fetchdata = useCallback(async (page = 1, limit = 10) => {
    if (!newSearchTerm) {
      setIsLoading(true);
    }
    axios.get(`${BASE_API_URL}employer-details/get-all/employer/details?term=${newSearchTerm}&page=${page}&limit=${limit}`).then((response) => {
      if (response?.data?.result === true) {
        setIsLoading(false);
        const data = response.data.data;
        const startingSerialNumber = (page - 1) * limit + 1;
        data.forEach((item, index) => {
          item.serialNumber = startingSerialNumber + index;
        });
        setEmployerDetails(data)
        setTotalPages(response.data.totalPages);
      } else if (response?.data?.result === false) {
        setIsLoading(false);
      }
    })
  }, [newSearchTerm])

  // Pagination page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    fetchdata(newPage);

  };

  const handleKeyPress = (e) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'];
    const isAlphanumeric = /^[a-zA-Z0-9\s]*$/.test(e.key);
    const isAllowedKey = allowedKeys.includes(e.key);
    const isModifierKey = e.shiftKey || e.ctrlKey || e.altKey || e.metaKey;
    if (!(isAlphanumeric || isAllowedKey) || isModifierKey) {
      e.preventDefault();
    }
  };

  const handleSearch = async (e) => {
    const inputValue = e.target.value;
    const newSearchTerm = inputValue.toLowerCase();
    setNewSearchTerm(newSearchTerm);
    setCurrentPage(1);
    fetchdata();
  };

  useEffect(() => {
    fetchdata();
  }, [fetchdata]);

  return (
    <Container fluid className="section">
      {isLoading && <Loader />}
      <Row>
        <Col
          lg={12}
          className="mb-4 d-flex justify-content-between align-items-center"
        >
          <h4 className="title mb-0">Employer details</h4>
        </Col>
      </Row>
      <Row className="justify-content-center mb-3">
        <Col lg={12}>
          <Card className="main-card">
            <Card.Body className="pb-0">
              <DataTable
                columns={columns}
                data={employerDetails}
                defaultSortFieldId={1}
                subHeader
                subHeaderComponent={
                  <input
                    className="form-control w-25"
                    type="text"
                    placeholder="Search..."
                    onChange={handleSearch}
                    onKeyDown={(e) => handleKeyPress(e)}
                  />
                }
              />
              <div className="table-border-top">
                <div className="my-4">
                  <PaginationComponent
                    currentPage={currentPage}
                    totalPages={totalPages}
                    handlePageChange={handlePageChange}
                  />
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};
