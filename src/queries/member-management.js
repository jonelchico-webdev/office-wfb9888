import {gql} from 'graphql.macro'; 

export const USER_MANAGEMENT_QUERY = gql`query UserManagement {
	userManagement {
		memberNumber
		accountNumber
		VIPRating
		memberLevel
		affiliatedAgent
		registrationTime
		status
		accountBalance
		lastLoginIP
		lastLoginTime
		numberOfDaysNotLoggedIn
		userName 
		account
		realName
		phoneNumber
		qqNumber
		birthday
		microChannelNumber
		email
		totalNumberOfDeposit
		totalAmountOfDeposit
		totalNumberOfWithdraw
		totalAmountOfWithdraw
		profitAndLoss
		effectiveBet
		bank1Address
		bank2Address
		card1Number
		card2Number
	}
}`

export const MEMBER_VIP_SYSTEM_QUERY = gql`query MemberVIPSystem {
	memberVIPSystem {
		grade
		rankName
		levelIcons
		requiredPoints
		attenuationIntegral
	}
}`

export const AGENT_MANAGEMENT_QUERY = gql`query AgentManagement {
	agentManagement {
		agentNumber
		accountNumber
		sourceURL
		VIPRating
		memberLevel
		registrationTime
		status
		accountBalance
		lastLoginIP
		lastLoginTime
		numberOfDaysNotLoggedIn
		account
		realName
		phoneNumber
		qqNumber
		birthday
		registeredIP
		microChannelNumber
		email
		totalNumberOfDeposit
		totalAmountOfDeposit
		totalNumberOfWithdraw
		totalAmountOfWithdraw
		profitAndLoss
		effectiveBet 
		bank1Address
		card1Number
		bank2Address
		card2Number
	}
}`

export const TRIAL_REVIEW_QUERY = gql`query TrialReview {
	trialReview {
		numbering
		phoneNumber
		registrationDate
		registrationTime
		registeredIp
		statusReview
		demoAccount
		tryPassword
		reviewer
		reviewDate
		reviewTime
	}
}`


export const USER_BANK_CARD_MANAGEMENT_QUERY = gql`query UserBankCardManagement {
	userBankCardManagement {
		id
		accountNumber
		bank
		cardNumber
		cardHolder
		province
		city 
		subBranch 
		status 
		addTime
		addPerson 
	}
}`

export const MEMBER_DEPOSIT_LEVEL = gql`query UserBankCardManagement {
	userBankCardManagement {
		hierarchicalName
		numberOfMembers
		amountOfDeposit
		numberOfDeposit
		companyDepositLimit
		onlineDepositLimit
		singleWithdrawalLimit
		withdrawalFeeCollectionMethod       
	}
}`

export const MEMBER_DEPOSIT_LEVEL_ITEM_QUERY = gql`query MemberDepositLevelItem {
	memberDepositLevel {
		id
		hierarchicalName
		numberOfMembers
		amountOfDeposit
		numberOfDeposit
		companyDepositLimit
		singleWithdrawalLimit
		withdrawalFeeCollectionMethod
		operating
	}
}`

export const MEMBER_DEPOSIT_LEVEL_HIERARCHY_MEMBER_DETAILS_ITEM_QUERY = gql`query HierarchyMemberDetailsItem {
	hierarchyMemberDetails {
		id
		accountNumber
		affiliatedAgent
		totalGeneration
		registrationTime
		lastLoginTime
		numberOfDeposits
		totalDeposit
		numberOfWithdrawals
		totalWithdrawal
		balance
		isLock
	}
}`

export const AGENT_REVIEW_QUERY = gql `query AgentReview {
	agentReview {
		memberNumber
		accountNumber
		sourceURL
		registrationDate
		registrationTime
		registeredIP
		statusReview
		currentlySelected
		reviewer
		lastLoginDate
		lastLoginTime
		chineseNickname
		englishName
		phoneNumber
		email
		qqNumber
		actualName
		bankNumber
		bankAddress
		bankImage
	}
}`

export const Try123 = gql`query Try123 {
	users {
		edges {
		  node {
			id
		   name
		   email
		   username
		   phone
		   registeredAt
		   vipLevel {
			 id
		   }
		   pk
		  }
		}
	  }
}`