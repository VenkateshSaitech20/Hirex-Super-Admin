import axios from "axios";
import Loader from "components/Loader";
import PaginationComponent from "components/PaginationComponents";
import React, { useCallback, useEffect, useState } from "react";
import { Card, Col, Container, Row } from "react-bootstrap";
import DataTable from "react-data-table-component";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const columns = [
  {
    name: "S.No",
    selector: (row) => row?.serialNumber,
    sortable: true,
    width: "100px",
  },
  { 
  name: "Name", 
  selector: (row) => row?.name, 
  sortable: true, 
  width: "200px" 
  },
  {
    name: "Email",
    selector: (row) => row?.email,
    sortable: true,
    width: "200px",
  },
  {
    name: "Mobile No",
    selector: (row) => row?.mobileNo,
    sortable: true,
    width: "200px",
  },
  {
    name: "Job Title",
    selector: (row) => row?.jobTitle?.title,
    sortable: true,
    width: "200px",
  },
  {
    name: "Salary",
    selector: (row) => row?.salary,
    sortable: true,
    width: "200px",
  },
  {
    name: "Experience",
    selector: (row) => row?.experience,
    sortable: true,
    width: "200px",
  },
  {
    name: "Qualification",
    selector: (row) => row?.qualification,
    sortable: true,
    width: "200px",
  },
  {
    name: "State",
    selector: (row) => row?.state?.stateName,
    sortable: true,
    width: "200px",
  },
  {
    name: "Location",
    selector: (row) => row?.district?.districtName,
    sortable: true,
    width: "200px",
  },
];

const CandidateDetails = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [candidateDetails, setCandidateDetails] = useState([]);
  const [newSearchTerm, setNewSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchdata = useCallback(async (page = 1, limit = 10) => {
    if (!newSearchTerm) {
      setIsLoading(true);
    }
    axios.get(`${BASE_API_URL}candidate-details/get-all/candidate/details?term=${newSearchTerm}&page=${page}&limit=${limit}`).then((response) => {
      if (response?.data?.result === true) {
        setIsLoading(false);
        const data = response.data.data;
        const startingSerialNumber = (page - 1) * limit + 1;
        data.forEach((item, index) => {
          item.serialNumber = startingSerialNumber + index;
        });
        setCandidateDetails(data)
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
          <h4 className="title mb-0">Candidate details</h4>
        </Col>
      </Row>
      <Row className="justify-content-center mb-3">
        <Col lg={12}>
          <Card className="main-card">
            <Card.Body className="pb-0">
              <DataTable
                columns={columns}
                data={candidateDetails}
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

export default CandidateDetails;
