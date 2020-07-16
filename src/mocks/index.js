import {makeExecutableSchema, addMockFunctionsToSchema, MockList} from 'graphql-tools';
import typeDefs from './type-defs';
import resolvers from './resolvers';
import {casual, array_of} from './data';

const Dashboard = {
	DataAnalysisReport: () => ({
		date: () => casual.date("YYYY-MM-DD"),
		activeToday: () => casual.integer(10, 100),
		newMemberToday: () => casual.integer(10, 100),
		rechargeAmount: () => casual.integer(10, 100),
		withdrawalAmount: () => casual.integer(10, 100),
		betAmount: () => casual.integer(10, 100),
		effectiveBet: () => casual.integer(10, 100),
		prizeAmount: () => casual.integer(10, 100)
	}),
	RecentUserDeviceUsage: () => {
		return {
			date: casual.date('YYYY-MM-DD'),
			pc: casual.integer(0,400),
			android: casual.integer(0,400),
			ios: casual.integer(0,400),
		}
	},
}

const FinancialManagement = {
	CompanyDepositReviewItem: () => ({
		id: casual.integer(100000, 999999),
		memberAccount: casual.username,
		hierarchy: casual.word,
		vipRating: casual.word,
		depositor: casual.name,
		depositTime: casual.date('YYYY-MM-DD'),
		companyBankInormation: casual.word,
		deposits: casual.integer(100, 1000),
		depositFee: casual.integer(10, 500),
		status: casual.status,
		operator: casual.first_name,
		operatingTime: casual.date('YYYY-MM-DD'),
		remarks: casual.word
	}),
	AccessionOverviewDeposit: () => ({
		successfulDepositAmount: casual.double(100, 100000).toFixed(2),
		numberOfSuccesses: casual.double(100, 100000).toFixed(2),
		totalNumberOfPen: casual.double(100, 100000).toFixed(2),
		successRate: casual.double(1, 100).toFixed(2),
	}),
	AccessionOverviewItem: () => ({
		date: casual.date('YYYY-MM-DD'),
		manualDeposit: casual.double(100, 100000).toFixed(2),
		totalDepositFee: casual.double(100, 100000).toFixed(2),
		memberWithdrawal: casual.double(100, 100000).toFixed(2),
		manualWithdrawal: casual.double(100, 100000).toFixed(2),
		totalWithdrawalFee: casual.double(100, 100000).toFixed(2),
		charge: casual.double(100, 100000).toFixed(2)
	}),
	OnlineDepositReviewItem: () => ({
		id: casual.integer(100000, 999999),
		memberAccount: casual.username,
		hierarchy: casual.word,
		vipRating: casual.word,
		depositTime: casual.date('YYYY-MM-DD'),
		tripartieChannelInformation: casual.sentence,
		deposits: casual.double(100, 100000).toFixed(2),
		depositFee: casual.double(100, 100000).toFixed(2),
		status: casual.status,
		operator: casual.username,
		operatingTime: casual.date('YYYY-MM-DD'),
		remarks: casual.word
	}),
	PaymentReviewItem: () => ({
		id: casual.integer(100000, 999999),
		memberAccount: casual.username,
		hierarchy: casual.word,
		vipRating: casual.word,
		withdrawalApplicationTime: casual.date('YYYY-MM-DD'),
		amountOfWithdrawal: casual.double(100, 100000).toFixed(2),
		cashWithdrawalBank: casual.word,
		accountBalance: casual.double(100, 100000).toFixed(2),
		status: casual.status,
		operator: casual.username,
		bonusControlReviewTime: casual.date('YYYY-MM-DD'),
		financialWithdrawTime: casual.date('YYYY-MM-DD'),
		remarks: casual.word
	}),
	CompanyDepositAccountManagementItem: () => ({
		id: casual.integer(100000, 999999),
		bankName: casual.word,
		accountHolder: casual.word,
		bankAccount: casual.word,
		accountOpeningBranch: casual.word,
		cumulativeAmount: casual.double(100, 100000).toFixed(2),
		amountDayDeposit: casual.double(100, 100000).toFixed(2),
		automaticDeactivationAmount: casual.double(100, 100000).toFixed(2),
		status: casual.status,
		membershipLevel: casual.word
	}),
	OnlineDepositAccountManagementItem: () => ({
		id: casual.integer(100000, 999999),
		businessName: casual.word,
		paymentTypes: casual.word,
		usingTheTerminal: casual.word,
		cumulativeAmount: casual.double(100, 100000).toFixed(2),
		theAmountOfTheDaysDeposit: casual.double(100, 100000).toFixed(2),
		automaticDeactivationAmount: casual.double(100, 100000).toFixed(2),
		status: casual.status,
		availableMembershipLevel: casual.word
	}),
	ManualDepositReviewItem: () => ({
		id: casual.integer(100000, 999999),
		depositSystem: casual.deposit_system,
		memberAccount: casual.username,
		hierarchy: casual.word,
		vipRating: casual.word,
		depositApplicant: casual.username,
		applicationTime: casual.date('YYYY-MM-DD'),
		depositType: casual.deposit_type,
		deposits: casual.double(100, 100000).toFixed(2),
		auditAmount: casual.double(100, 100000).toFixed(2),
		status: casual.status,
		operator: casual.first_name,
		operatingTime: casual.date('YYYY-MM-DD'),
		remarks: casual.word
	}),
	ManualWithdrawalReviewItem: () => ({
		id: casual.integer(100000, 999999),
		memberAccount: casual.username,
		memberLevel: casual.word,
		vipRating: casual.word,
		cashApplicant: casual.first_name,
		applicationTime: casual.date('YYYY-MM-DD'),
		withdrawalType: casual.withdrawal_type,
		deposits: casual.double(100, 100000).toFixed(2),
		auditAmount: casual.double(100, 100000).toFixed(2),
		status: casual.status,
		operator: casual.first_name,
		operatingTime: casual.date('YYYY-MM-DD'),
		remarks: casual.word
	})
}

const GameManagement = {
	GameManagementItem: () => ({
		id: casual.integer(100000, 999999),
		serialNumber: casual.integer(100000, 999999),
		vendor: casual.name,
		status: casual.status,
		gameName: casual.title,
		gameCategory: casual.word,
		sortWeight: casual.integer(100, 200),
		operating: casual.word
	}),
	
	LiveVideoItem: () => ({
		id: casual.integer(100000, 999999),
		serialNumber: casual.integer(100000, 999999),
		vendor: casual.name,
		status: casual.status,
		gameName: casual.title,
		gameCategory: casual.word,
		sortWeight: casual.integer(100, 200),
		operating: casual.word
	}),
}

const MemberManagement = {
	UserManagementItem: () => ({
		memberNumber: casual.integer(100000, 999999),
		userName: casual.name,
		accountNumber: casual.integer(100000, 999999),
		VIPRating: casual.word,
		memberLevel: casual.word,
		affiliatedAgent: casual.word,
		registrationTime: casual.date('YYYY-MM-DD'),
		status: casual.boolean,
		accountBalance: casual.integer(100000, 999999),
		lastLoginIP: casual.date('YYYY-MM-DD'),	
		lastLoginTime: casual.date('YYYY-MM-DD'),
		numberOfDaysNotLoggedIn: casual.integer(0, 999),
		account: casual.word,
		realName: casual.name,
		phoneNumber: casual.phone,
		qqNumber: casual.integer(100000, 999999),
		birthday: casual.date('YYYY-MM-DD'),
		microChannelNumber: casual.word+casual.integer(100, 9999),
		email: casual.email,
		totalNumberOfDeposit: casual.integer(10, 100),
		totalAmountOfDeposit: casual.integer(100000, 999999),
		totalNumberOfWithdraw: casual.integer(10, 100),
		totalAmountOfWithdraw: casual.integer(100000, 999999),
		profitAndLoss: casual.integer(100000, 999999),
		effectiveBet: casual.integer(100000, 999999),
		bank1Address: casual.address, 
		bank2Address: casual.address, 
		card1Number: casual.random,
		card2Number: casual.random,
	}),

	MemberVIPSystemItem: () => ({
		grade: casual.integer(100000, 999999),
		rankName: casual.integer(0, 10),
		levelIcons: casual.integer(1, 4),
		requiredPoints: casual.integer(0, 999999),
		attenuationIntegral: casual.integer(0, 1000),
	}),

	UserBankCardManagementItem: () => ({
		id: casual.integer(100000, 999999), 
		accountNumber: casual.integer(100, 999999), 
		bank: casual.word,
		cardNumber: casual.integer(1000000, 9999999),
		cardHolder: casual.word,
		province: casual.province,
		city: casual.city,
		subBranch: casual.word,
		status: casual.status,	
		addTime: casual.date('YYYY-MM-DD'),
		addPerson: casual.username
	}),
	
	TrialReviewItem: () => ({
		numbering: casual.integer(100000, 999999),
		phoneNumber: casual.integer(9612000000, 9620000000),
		registrationDate: casual.date('YYYY-MM-DD'),
		registrationTime: casual.time('HH:mm:ss'),
		registeredIp: casual.ip,
		statusReview: casual.integer(1, 3),
		demoAccount: casual.word,
		tryPassword: casual.word,
		reviewer: casual.integer(1, 10),
		reviewDate: casual.date('YYYY-MM-DD'),
		reviewTime: casual.time('HH:mm:ss'),
	}),
	AgentReviewItem: () => ({
		memberNumber: casual.integer(100000, 999999),
		accountNumber: casual.integer(100000, 999999),
		sourceURL: casual.url,
		bankImage: casual.integer(1,2),
		registrationDate: casual.date('YYYY-MM-DD'),
		registrationTime: casual.time('HH:mm:ss'),
		registeredIP: casual.ip,
		statusReview: casual.integer(1, 3),
		currentlySelected: '',
		reviewer: casual.name,
		lastLoginDate: casual.date('YYYY-MM-DD'),
		lastLoginTime: casual.time('HH:mm:ss'),
		englishName: casual.first_name,
		actualName: casual.last_name,
		gameCheck: casual.integer(1,4),
		phoneNumber: casual.integer(9612000000, 9620000000),
		email: casual.email,
		qqNumber: casual.integer(10000000, 99999999),
		bankNumber: casual.integer(1000000000000000, 9999999999999999),
		bankAddress: casual.address,
	}),
	AgentManagementItem: () => ({
		agentNumber: casual.integer(100000, 999999),
		accountNumber: casual.integer(100000, 999999),
		sourceURL: casual.url,
		VIPRating: casual.integer(1, 4),
		memberLevel: casual.word,
		registrationTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:MM:SS'),
		status: casual.boolean,
		accountBalance: casual.integer(100000, 999999),
		lastLoginIP: casual.ip,
		lastLoginTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:MM:SS'),
		numberOfDaysNotLoggedIn: casual.integer(1, 100),
		registeredIP: casual.ip,
		account: casual.word,
		realName: casual.name,
		phoneNumber: casual.phone,
		qqNumber: casual.integer(100000, 999999),
		birthday: casual.date('YYYY-MM-DD'),
		microChannelNumber: casual.word+casual.integer(100, 9999),
		email: casual.email,
		totalNumberOfDeposit: casual.integer(10, 100),
		totalAmountOfDeposit: casual.integer(100000, 999999),
		totalNumberOfWithdraw: casual.integer(10, 100),
		totalAmountOfWithdraw: casual.integer(100000, 999999),
		profitAndLoss: casual.integer(100000, 999999),
		effectiveBet: casual.integer(100000, 999999),
		bank1Address: casual.address, 
		bank2Address: casual.address, 
		card1Number: casual.random,
		card2Number: casual.random,
	}),
		
	memberDepositLevelItem: () => ({
		id: casual.integer(1000,9999),
		hierarchicalName: casual.card_type,
		numberOfMembers: casual.integer(10, 100), 
		amountOfDeposit: casual.integer(10000, 20000), 
		numberOfDeposit: casual.integer(0, 100), 
		companyDepositLimit: casual.integer(5000, 10000), 
		onlineDepositLimit: casual.integer(5000, 10000),
		singleWithdrawalLimit: casual.integer(5000, 10000),
		withdrawalFeeCollectionMethod: casual.word,
		operating: casual.integer(0, 2),

 
	}),
		
	HierarchyMemberDetailsItem: () => ({ 
		id: casual.integer(100001,200000),
		accountNumber: casual.integer(1000,9999),
		affiliatedAgent: casual.word,
		totalGeneration: casual.word,
		registrationTime: casual.date('YYYY-MM-DD'),
		lastLoginTime: casual.date('YYYY-MM-DD'), 
		numberOfDeposits: casual.integer(1, 100),
		totalDeposit: casual.integer(5000, 10000),
		numberOfWithdrawals: casual.integer(1, 100),
		totalWithdrawal: casual.integer(5000, 10000),
		balance: casual.integer(5000, 10000),
		isLock: casual.integer(0, 1),

		
	})
}

const OperationalRiskControl = {
	NoteManagementItem: () => ({
		orderNumber: casual.word+casual.integer(1, 100),
		memberAccount: 'test'+casual.integer(1, 9),
		belongLevel: casual.word,
		gameMaker: casual.full_name,
		gameName: casual.words(2),
		threePartyOrderNumber: casual.word+casual.integer(100000,999999),
		betTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:mm:ss'),
		betAmount: casual.integer(10, 100).toFixed(2),
		effectiveBet: casual.integer(10, 100).toFixed(2),
		awardTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:mm:ss'),
		prizeAmount: casual.integer(0, 1000).toFixed(2),
		handlingFee: casual.integer(0, 50).toFixed(2),
		profitAndLoss: casual.integer(-9999, 9999).toFixed(2)
	}),
	FlowAuditItem: () => ({
		depositTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:mm:ss'),
        depositIntoTheWater: casual.integer(0, 300),
        depositAmount: casual.integer(0, 200),
        completedAmount: casual.integer(0, 200),
        depositNeedsToBeAudited: casual.integer(0, 200),
        administrativeFeeDeduction: casual.integer(0, 200),
        discountedPrice: casual.integer(0, 200),
        offerNeedsToBeAudited: casual.integer(0, 200),
        discountDeduction: casual.integer(0, 200),
	}),
	MoneyControlConditionManagementItem: () => ({
		no: 100000,
		condition: casual.integer(0, 5),
		judge: casual.integer(0, 4),
		value: casual.integer(0, 100),
		status: casual.integer(0, 1),
		delete: 0
	}),
	MoneyControlAuditItem: () => ({
		orderNumber: 'TK'+casual.integer(100000, 100199),
		memberAccount: 'Test'+casual.integer(1, 9),
		hierarchy: 'Level '+casual.integer(1, 9),
		VIPRating: 'VIP'+casual.integer(0, 5),
		withdrawalApplicationTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:mm:ss'),
		numberOfWithdrawals: casual.integer(1, 100),
		applicationForWithdrawalAmount: casual.integer(100, 9000),
		accountBalance: casual.integer(500, 10000),
		handlingFee: casual.integer(0, 100),
		administrativeFee: casual.integer(0, 100), 
		discountDeduction: casual.integer(0, 500),
		amountOfWithdrawal: casual.integer(100, 5000),
		systemAudit: casual.integer(0, 1),
		status: casual.integer(0, 2),
		operator: 'admin'+casual.integer(1, 5),
		operatingTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:mm:ss'),
		note: 1,
		noteDetails: '',
	})
}



const AnnouncementManagement = {

	SystemNotificationItem: () => ({
		serialNumber: casual.integer(10001, 99999),
		announcementTitle: casual.catch_phrase,
		displayForm: casual.word,
		announcementStartDate: casual.date('YYYY-MM-DD'),
		announcementStartTime: casual.time('HH:mm:ss'),
		announcementEndDate: casual.date('YYYY-MM-DD'),
		announcementEndTime: casual.time('HH:mm:ss'),
		sortWeight: casual.integer(1, 99),
		addAPerson: casual.last_name,
		withdrawalAmount: casual.integer(1, 9999),
	}),

	AppPushItem: () => ({
		serialNumber: casual.integer(10001, 99999),
		pushContent: casual.catch_phrase,
		pushStartDate: casual.date('YYYY-MM-DD'),
		pushStartTime: casual.time('HH:mm:ss'),
		creationTime: casual.date('YYYY-MM-DD') + ' ' + casual.time('HH:mm:ss')
	}),

	CopywritingManagementItem: () => ({
		serialNumber: casual.integer(10001, 99999),
		copyName: casual.word,
		displayPosition: casual.word,
        sortWeight: casual.integer(1,99),
        founder: casual.first_name,
        modifier: casual.last_name,
        withdrawalAmount: casual.integer(1,9999)
	}),

	HomeCarouselManagementItem: () => ({
		serialNumber: casual.integer(10001,99999),
		name: casual.name,
		displayForm: casual.file_extension,
		link: casual.domain,
		sortWeight: casual.integer(1,99),
		addAPerson: casual.first_name,
		modifier: casual.last_name,
		lastModified: casual.date('YYYY-MM-DD') + ' ' + casual.time('HH:mm:ss')
	}),

	MemberNewsInboxItem: () => ({
		serialNumber: casual.integer(10001,99999),
		messageTitle: casual.word,
		messageCategory: casual.word,
		recipient: casual.first_name,
		sendingTime: casual.date('YYYY-MM-DD') + ' ' + casual.time('HH:mm:ss'),
		sender: casual.last_name,
		status: casual.integer(0,1)
	}),

	MemberNewsOutboxItem: () => ({
		serialNumber: casual.integer(10001,99999),
		messageTitle: casual.word,
		messageCategory: casual.word,
		recipient: casual.first_name,
		sendingTime: casual.date('YYYY-MM-DD') + ' ' + casual.time('HH:mm:ss'),
		sender: casual.last_name,
		status: casual.integer(0,1)
	})

}

const CommissionSystem = {
	CommissionManagementItem: () => ({
		no: casual.integer(10001, 99999),
        commissionName:casual.catch_phrase,
        status: casual.boolean,
        statisticalPeriod: casual.integer(1, 4),
        created: casual.date('YYYY-MM-DD')+' '+casual.time('HH:mm:ss'),
        founder:casual.name,
        lastUpdate: casual.date('YYYY-MM-DD')+' '+casual.time('HH:mm:ss'),
        updater: casual.name
	}),

	CommissionStatisticsItem: () => ({
        date: casual.date('YYYY-MM-DD'),
        userName: casual.name,
        belongsTo: casual.name,
        commissionType: casual.word,
        amount: casual.integer(10000, 99999),
        status: casual.boolean,
        operator: casual.name,
		operatingTime: casual.time('HH:mm:ss'),
		remarks: casual.word
	})
}

const ElectricSales = {
	FirstPaymentVerificationItem: () => ({
		orderNumber: casual.integer(10000, 99999),
		memberAccount: casual.name,
		hierarchy: casual.integer(1, 9),
		VIPRating: casual.integer(1, 5),
		withdrawalApplicationTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:mm:ss'),
		numberOfWithdrawals: casual.integer(1, 9),
		applicationForWithdrawalAmount: casual.integer(10000, 99999),
		accountBalance: casual.integer(10000, 99999),
		handlingFee: casual.integer(10000, 99999),
		administrativeFee: casual.integer(10000, 99999),
		discountDeduction: casual.integer(50, 2000),
		amountOfWithdrawal: casual.integer(1000, 50000),
		status: casual.boolean,
		operator: casual.name,
		operatingTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:mm:ss')
	})
}

const ActivityManagement = {
	EventListItem: () => ({
		id: casual.integer(10001, 200000),
		serialNumber: casual.integer(100000, 999999),
		eventName: casual.name,
		company: casual.word,
		typeOfActivity: casual.word,
		activityStartTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:MM:SS'),
		eventEndTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:MM:SS'),
		creationTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:MM:SS'),
		founder: casual.name,
		lastUpdateTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:MM:SS'),
		updater: casual.name,
		status: casual.boolean,
		operating: casual.boolean,
	}),
	

	ActivityReviewItem: () => ({
		id: casual.integer(10001, 200000),
		serialNumber: casual.integer(100000, 999999),
		eventName: casual.name,
		company: casual.word,
		accountNumber: casual.integer(10001124, 2001231000),
		affiliatedAgent: casual.name,
		rechargeToday: casual.integer(100000, 999999),
		effectiveBettingToday: casual.integer(100000, 999999),
		applicationTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:MM:SS'),
		discountedPrice: casual.integer(100, 2000),
		status: casual.boolean,
		reviewer: casual.name,
		reviewTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:MM:SS'),
	})

}


const LogManagement = {
	UserLoginLogItem: () => ({
		numbering: casual.integer(10000, 99999),
		playerAccount: casual.name,
		affiliatedAgent: casual.name,
		loginTime: casual.date('YYYY-MM-DD')+' '+casual.time('HH:mm:ss'),
		loginIP: casual.ip,
		loginUrl: casual.url,
		loginResult: casual.boolean
	})
}



const ReportManagement= {
	UserReportItem: () => ({ 
		id: casual.integer(1, 9999),
		accountNumber: casual.integer(1, 9999),
		date: casual.date('YYYY-MM-DD'),
		activeUser: casual.integer(1, 9999),
		numberOfBets: casual.integer(10, 999999),
		newUsers: casual.word,
		newUserRecharge: casual.word,
		retainedTheNextDay: casual.word,
		threeDaysOfRetention: casual.word,
		fiveDaysToSurvive: casual.word,
		retainedOnThe7th: casual.word,
		remainingOnThe15thDay: casual.word, 
	}),

	ProfitAndLossDateReportItem: () => ({  

		id: casual.integer(1, 9999),
		accountNumber: casual.integer(1, 9999),
		date: casual.date('YYYY-MM-DD'),
		activeUser: casual.integer(1, 9999),
		numberOfBets: casual.integer(10, 999999),
		numberOfPeopleBets: casual.integer(10, 999999),
		betAmount: casual.integer(10, 999999),
		effectiveBet: casual.integer(10, 999999),
		prizeAmount: casual.integer(10, 999999),
		profitAndLoss: casual.integer(10, 999999), 
	}),

	ProfitAndLossStatementsItem: () => ({   
		id: casual.integer(1, 9999),
		accountNumber: casual.integer(1, 9999),
		date: casual.date('YYYY-MM-DD'),
		proxyAccount: casual.word,
		affiliatedAgent: casual.word,
		betAmount: casual.integer(10, 999999),
		effectiveBet: casual.integer(10, 999999),
		numberOfBet: casual.integer(10, 999999),
		numberOfPeopleBet: casual.integer(10, 999999), 
		prizeAmount: casual.integer(10, 999999),
		profitAndLossStatement: casual.integer(10, 999999),  
	}),

	RechargeReportItem: () => ({   
		id: casual.integer(1, 9999),
		accountNumber: casual.integer(1, 9999),
		date: casual.date('YYYY-MM-DD'),
		proxyAccount: casual.word,
		affiliatedAgent: casual.word, 
		rechargeAmount: casual.integer(10, 999999), 
		numberOfRecharges: casual.integer(10, 999999),
		rechargeNumber: casual.integer(10, 999999),
		topUpOffer: casual.integer(10, 999999),  
		rechargeFee: casual.integer(10, 999999),  
		numerOfWithdrawals: casual.integer(10, 999999),  
		numerOfPeopleWithdrawals: casual.integer(10, 999999), 
		withdrawalAmount: casual.integer(10, 999999),  
		withdrawalFee: casual.integer(10, 999999),
		charge: casual.integer(10, 999999),  

	}),

	AccountChangeReportItem: () => ({   
		id: casual.integer(1, 9999),
		accountNumber: casual.integer(1, 9999),
		date: casual.date('YYYY-MM-DD'),
		transactionFlow: casual.word,
		proxyAccount: casual.word,
		affiliatedAgent: casual.word,  
		transactionHour: casual.date('YYYY-MM-DD'),
		transactionType: casual.word,
		preTransaction: casual.integer(10, 999999), 
		theTransactionAccount: casual.integer(10, 999999), 
		postTradeAmount: casual.integer(10, 999999), 
		transactionNote: casual.word,  
	}),

	RechargeDailyReportItem: () => ({   
		id: casual.integer(1, 9999),
		accountNumber: casual.integer(1, 9999),
		date: casual.date('YYYY-MM-DD'),
		rechargeAmount: casual.integer(10, 999999), 
		numberOfRecharges: casual.integer(10, 999999),
		rechargeNumber: casual.integer(10, 999999),
		topUpOffer: casual.integer(10, 999999),
		rechargeFee: casual.integer(10, 999999),
		numberOfWithdrawals: casual.integer(10, 999999),
		numberOfPeopleWithdraw: casual.integer(10, 999999),
		withdrawalAmount: casual.integer(10, 999999),
		withdrawalFee: casual.integer(10, 999999),
		charge: casual.integer(10, 999999),
		rechargeDailyReport: casual.integer(10, 999999), 
	}),
	 
	OperationalGeneralReportItem: () => ({   
		id: casual.integer(1, 9999),
		accountNumber: casual.integer(1, 9999),
		date: casual.date('YYYY-MM-DD'),
		totalData: casual.word,  
		proxyData: casual.integer(10, 999999),  
		activeMember: casual.integer(10, 999999),  
		rechargeAmount: casual.integer(10, 999999),  
		numberOfRecharges: casual.integer(10, 999999), 
		rechargeNumber: casual.integer(10, 999999), 
		withdrawalAmount: casual.integer(10, 999999),  
		numberOfWithdrawal: casual.integer(10, 999999),  
		numberOfPeopleWithdrawal: casual.integer(10, 999999),  
		betAmount: casual.integer(10, 999999),  
		effectiveBet: casual.integer(10, 999999),  
		numberOfBet: casual.integer(10, 999999),  
		numberOfPeopleBets: casual.integer(10, 999999),  
		profitAndLoss: casual.integer(10, 999999),  
		proxyAccount: casual.integer(10, 999999),  
		 
	}),

	
	
}

const mocks = {
	Query: () => ({
		barCharts: () => new MockList(4),
		doughnutChart: () => {
			return {
				title: casual.word,
				labels: array_of(10, () => casual.province),
				datasets: [{label: 'top 10', data: array_of(10, () => casual.integer(20, 100)),}]
			}
		},
		recentUserDeviceUsages: () => new MockList(7),
		companyDepositAccountsReview: () => new MockList(10),
		dataAnalysisReport: () => new MockList(7),
		accessionOverview: () => new MockList(10),
		onlineDepositReview: () => new MockList(10),
		paymentReview: () => new MockList(10),
		companyDepositAccountManagement: () => new MockList(10),
		onlineDepositAccountManagement: () => new MockList(10),
		gameManagement: () => new MockList(8),
		depositLevels: () => new MockList(10),
		vipRatings: () => new MockList(10),
		manualDepositReview: () => new MockList(10),
		manualWithdrawalReview: () => new MockList(10),
		electronicGames: () => new MockList(10),
		liveVideo: () => new MockList(10),
		chessGame: () => new MockList(10),
		sportsCompetition: () => new MockList(10),
		userManagement: () => new MockList(15),
		memberVIPSystem: () => new MockList(7),
		userBankCardManagement: () => new MockList(5),
 		memberDepositLevel: () => new MockList(3),
 		hierarchyMemberDetails: () => new MockList(6),
		trialReview: () => new MockList(15),
		agentManagement: () => new MockList(7),
		agentReview: () => new MockList(5),		
		userReport: () => new MockList(10),
		profitAndLossDateReport: () => new MockList(10),
		profitAndLossStatement: ()=> new MockList(10),
		rechargeReport: ()=> new MockList(10),
		accountChangeReport: ()=> new MockList(10),
		rechargeDailyReport: ()=> new MockList(10),
		operationalGeneralReport: () => new MockList(10),
		noteManagement: () => new MockList(30),
		flowAudit: () => new MockList(15),
		moneyControlConditionManagement: () => new MockList(7),	 
		moneyControlAudit: () => new MockList(10),	 
		eventList: () => new MockList(15),
		systemNotification: () => new MockList(15),	 
		appPush: () => new MockList(5),
		copywritingManagement: () => new MockList(5),
		homeCarouselManagement: () => new MockList(5),
		commissionManagement: () => new MockList(15),	 
		activityReview: () => new MockList(15),
		commissionStatistics: () => new MockList(15),
		firstPaymentVerification: () => new MockList(15),	
		memberNewsInbox: () => new MockList(15),
		memberNewsOutbox: () => new MockList(15),
		userLoginLog: () => new MockList(5),
	}),
	Chart: () => {
		let num = casual.integer(1,2);
		return {
			title: casual.word,
			labels: array_of(7, () => casual.date('YYYY-MM-DD')),
			datasets: () => new MockList(num)
		}		
	},
	DataLabel: () => ({
		data: array_of(7, () => casual.integer(20, 100)),
		label: casual.word
	}),
	DepositLevel: () => ({
		id: casual.uuid,
		name: 'Level ' + casual.integer(1, 100)
	}),
	VIPRating: () => ({
		id: casual.uuid,
		name: 'VIP ' + casual.integer(1, 100)
	}),
	...Dashboard,
	...FinancialManagement,
	...GameManagement,
	...MemberManagement,
	...ReportManagement,
	...OperationalRiskControl,
	...AnnouncementManagement,
	...ActivityManagement,
	...CommissionSystem,
	...ElectricSales,
	...LogManagement,
};

const schema = makeExecutableSchema({
	typeDefs,
	resolvers,
});

const preserveResolvers = true;

addMockFunctionsToSchema({
	schema,
	mocks,
	preserveResolvers
});

export default schema;
