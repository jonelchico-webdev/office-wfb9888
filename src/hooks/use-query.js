import { useEffect, useState, useContext } from 'react';
import { ClientContext } from '../client-context';

function useQuery({ query, variables, formatter, mock, defs }) {
	const [response, setResponse] = useState({
		data: null, loading: true, errors: null, formattedData: null,
	});
	let clientContext = useContext(ClientContext);
	let client = clientContext.myClient;

	if (mock) {
		client = clientContext.mockClient;
	}

	useEffect(() => {
		async function fetchData() {
			const res = await client.query({
				query,
				variables,
			});
			setResponse({
				...res,
				formattedData: formatter ? formatter(res.data) : null,
				errors: res.errors ? res.errors[0].message : null
			});
		}
		fetchData();
	}, defs);
	return response;
}

export default useQuery;