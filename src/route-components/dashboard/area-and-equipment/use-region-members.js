import gql from 'graphql-tag';
import useQuery from '../../../hooks/use-query';
import Cookies from 'universal-cookie';


const REGION_MEMBER_QUERY = gql`query  RegionMembers($fromDate: String!, $toDate: String!, $strategy: String) {
	dashboard(fromDate: $fromDate, toDate: $toDate, strategy: $strategy) {
		regionMembers {
			count
			regionCode
		}
	}
}`

export default function useRegionMembers({fromDate, toDate}) {

const cookies = new Cookies();
const strategy = cookies.get('userType') === 'staff' ? "backoffice" : "affiliate"
	return useQuery({
		query: REGION_MEMBER_QUERY,
		variables: {
			fromDate, toDate, strategy
		},
		defs: [fromDate, toDate]
	});
}