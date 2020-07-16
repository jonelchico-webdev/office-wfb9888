import { useState } from 'react';

export default function usePagination() {
	const [rowsPerPage, setRowsPerPage] = useState(15);
	const [page, setPage] = useState(0)
	const [cursor, setCursor] = useState({
		before: null,
		after: null
	});
	const handleRowsPerPageChange = (event) => {
		setRowsPerPage(event.target.value);
		setPage(0)
		setCursor({
			before: null,
			after: null
		});
	}
	const handleOnClickPrevious = (value) => () => {
		setCursor(oldValues => ({
			before: value,
			after: null 
		}));
		setPage(page - 1)
	}
	const handleOnClickNext = (value) => () => {		
		setCursor(oldValues => ({
			before: null,
			after: value
		}));
		setPage(page + 1)
	}

	const handlePageChange = (value) => () => {
		let newValue = value*rowsPerPage
		if (value == 0) {
			setCursor({
				before: null,
				after: null
			})
			setPage(value)
		} else  {
			setCursor(oldValues => ({
				before: null,
				after: newValue-1
			}))
			setPage(value)
		} 
	}

	return {
		rowsPerPage,
		handleRowsPerPageChange,
		cursor,
		page,
		handleOnClickPrevious,
		handleOnClickNext,
		handlePageChange,
		setCursor,
		setPage
	}
}