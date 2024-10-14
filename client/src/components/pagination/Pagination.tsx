// components/Pagination.tsx
import React from "react";
import "./pagination.css"
import { Button } from "antd";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  handleNextPage: (page: number) => void;
  handlePreviousPage:(page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  handlePreviousPage,
  currentPage,
  totalPages,
  handleNextPage,
}) => {
  return (
    <div className="pagination">
    <Button type="primary" onClick={() => handlePreviousPage(currentPage - 1)}  disabled={currentPage === 1}>
      Previous
    </Button>
    <span style={{padding:"0 10px"}}>Page {currentPage} of {totalPages}</span>
    <Button type="primary" onClick={() => handleNextPage(currentPage + 1)} disabled={currentPage === totalPages}>
      Next
    </Button>
  </div>
  );
};

export default Pagination;
