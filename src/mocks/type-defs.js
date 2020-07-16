export default `
	scalar DateTime
	scalar Decimal

	type AuthPayload {
		token: String!
		user: User!
	}

	type User {
		firstname: String!
		lastname: String!
	}

	type Chart {
		title: String!
		labels: [String!]
		datasets: [DataLabel]!
	}

	type DataLabel {
		data: [Int!],
		label: String!
	}

	#Dashboard
	type DataAnalysisSummary {
		id: Int!,
		name: String!
		label: String!
		unit: String!
		number: Int!
	}

	#Dashboard
	type RecentUserDeviceUsage {
		date: String!
		pc: Int!
		android: Int!
		ios: Int!
	}

	#Dashboard
	type DataAnalysisReport {
		date: DateTime!,
		activeToday: Int!
		newMemberToday: Int!
		rechargeAmount: Decimal!
		withdrawalAmount: Decimal!
		betAmount: Decimal!
		effectiveBet: Decimal!
		prizeAmount: Decimal!

	}

	#Financial Management
	type AccessionOverviewDeposit {
		successfulDepositAmount: Decimal!
		numberOfSuccesses: Decimal!
		totalNumberOfPen: Decimal!
		successRate: String!
	}
	
	#Financial Management
	type AccessionOverviewItem {
		date: DateTime!
		companyDeposit: AccessionOverviewDeposit!
		onlinePayment: AccessionOverviewDeposit!
		manualDeposit: Decimal!
		totalDepositFee: Decimal!
		memberWithdrawal: Decimal!
		manualWithdrawal: Decimal!
		totalWithdrawalFee: Decimal!
		charge: Decimal!
	}

	#FinancialManagement
	type CompanyDepositReviewItem {
		id: String!
		memberAccount: String!
		hierarchy: String!
		vipRating: String!
		depositor: String!
		depositTime: DateTime!
		companyBankInormation: String!
		deposits:Decimal!
		depositFee: Decimal!
		status: String!
		operator: String
		operatingTime: DateTime!
		remarks: String
	}

	#FinancialManagement
	type OnlineDepositReviewItem {
		id: String!,
		memberAccount: String!
		hierarchy: String!
		vipRating: String!
		depositTime: DateTime!
		tripartiteChannelInformation: String!
		deposits:Decimal!
		depositFee: Decimal!
		status: String!
		operator: String
		operatingTime: DateTime!
		remarks: String
	}

	#FinancialManagement
	type PaymentReviewItem {
		id: String!
		memberAccount: String!
		hierarchy: String!
		vipRating: String!
		withdrawalApplicationTime: DateTime!
		amountOfWithdrawal: Decimal!
		cashWithdrawalBank: String!
		accountBalance: Decimal!
		status: String!
		operator: String
		bonusControlReviewTime: DateTime!
		financialWithdrawTime: DateTime!
		remarks: String
	}

	#FinancialManagement
	type CompanyDepositAccountManagementItem {
		id: String!
		bankName: String!
		accountHolder: String!
		bankAccount: String!
		accountOpeningBranch: String!
		cumulativeAmount: Decimal!
		amountDayDeposit: Decimal!
		automaticDeactivationAmount: Decimal!
		status: String!
		membershipLevel: String!
	}

	#FinancialManagement
	type OnlineDepositAccountManagementItem {
		id: String!
		businessName: String!
		paymentTypes: String!
		usingTheTerminal: String!
		cumulativeAmount: Decimal!
		theAmountOfTheDaysDeposit: Decimal! 
		automaticDeactivationAmount: Decimal!
		status: String!
		availableMembershipLevel: String!
	}

	#FinancialManagement
	type ManualDepositReviewItem {
		id: String!
		depositSystem: String!
		memberAccount: String!
		hierarchy: String!
		vipRating: String!
		depositApplicant: String!
		applicationTime: DateTime!
		depositType: String!
		deposits:Decimal!
		auditAmount: Decimal!
		status: String!
		operator: String
		operatingTime: DateTime!
		remarks: String
	}

	#FinancialManagement
	type ManualWithdrawalReviewItem {
		id: String!
		memberAccount: String!
		memberLevel: String!
		vipRating: String!
		cashApplicant: String!
		applicationTime: DateTime!
		withdrawalType: String!
		deposits:Decimal!
		auditAmount: Decimal!
		status: String!
		operator: String
		operatingTime: DateTime!
		remarks: String
	}

	#GameManagement
	type GameManagementItem {
		id: String!
		serialNumber: Decimal!
		vendor: String!
		status: String!
		gameName: String!
		gameCategory: String!
		sortWeight: Decimal!
		operating: String!
	}

	#GameManagement
	type LiveVideoItem {
		id: String!
		serialNumber: Decimal!
		vendor: String!
		status: String!
		gameName: String!
		gameCategory: String!
		sortWeight: Decimal!
		operating: String!
	}

	#MemberManagement
	type UserManagementItem {
		memberNumber: Int!
		accountNumber: Int!
		VIPRating: String!
		memberLevel: String!
		affiliatedAgent: String!
		registrationTime: DateTime!
		status: Int!
		accountBalance: Int!
		lastLoginIP: DateTime!
		lastLoginTime: DateTime!
		numberOfDaysNotLoggedIn: DateTime!
		userName: String!

		account: String!
		realName: String!
		phoneNumber: String!
		qqNumber: Int!
		birthday: DateTime!
		microChannelNumber: String!
		email: String!
		totalNumberOfDeposit:  Int!
		totalAmountOfDeposit: Int!
		totalNumberOfWithdraw:  Int!
		totalAmountOfWithdraw: Int!
		profitAndLoss: Int!
		effectiveBet: Int! 
		bank1Address: String!
		bank2Address: String!
		card1Number: String!
		card2Number: String!
	}

	#MemberManagement
	type MemberVIPSystemItem {
		grade: Int!
		rankName: Int!
		levelIcons: Int!
		requiredPoints: Int!
		attenuationIntegral: Int!
	}

	#MemberManagement
	type UserBankCardManagementItem {
		id: String! 
		accountNumber: Int!
		bank(filter: String): String!
		cardNumber: Int!
		cardHolder: String!
		province: String!
		city: String!
		subBranch: String!
		status: String!
		addTime: DateTime!
		addPerson: String! 
	}
	type TrialReviewItem {
		numbering: Int!,
		phoneNumber: String!,
		registrationDate: DateTime!,
		registrationTime: DateTime!,
		registeredIp: String!,
		statusReview: Int!,
		demoAccount: String!,
		tryPassword: String!,
		reviewer: Int!,
		reviewDate: DateTime!,
		reviewTime: DateTime!,
	}
	type AgentReviewItem{
		memberNumber: Int!,
		accountNumber: Int!,
		sourceURL: String!
		registrationDate: DateTime!,
		registrationTime: DateTime!,
		registeredIP: String!,
		statusReview: Int!,
		currentlySelected: String!,
		reviewer: String!,
		lastLoginDate: DateTime!,
		lastLoginTime: DateTime!,
		chineseNickname: String!,
		englishName: String!,
		phoneNumber: String!,
		email: String!,
		qqNumber: Int!,
		actualName: String!,
		bankNumber: String!,
		bankAddress: String!,
		bankImage: Int!,
		gameCheck: Int!,
	}

	type AgentManagementItem {
		agentNumber: Int!
		accountNumber: Int!
		sourceURL: String!
		VIPRating: Int!
		memberLevel: String!
		registrationTime: DateTime!
		status: Int!
		accountBalance: Int!
		lastLoginIP: String!
		lastLoginTime: DateTime!
		numberOfDaysNotLoggedIn: Int!
		registeredIP: String!
		account: String!
		realName: String!
		phoneNumber: String!
		qqNumber: Int!
		birthday: DateTime!
		microChannelNumber: String!
		email: String!
		totalNumberOfDeposit:  Int!
		totalAmountOfDeposit: Int!
		totalNumberOfWithdraw:  Int!
		totalAmountOfWithdraw: Int!
		profitAndLoss: Int!
		effectiveBet: Int! 
		bank1Address: String!
		bank2Address: String!
		card1Number: String!
		card2Number: String!
	}
 
	#MemberManagement 
	type memberDepositLevelItem {
		hierarchicalName: String!
		numberOfMembers: Int!
		amountOfDeposit: Int!
		numberOfDeposit: Int!
		companyDepositLimit: Int!
		onlineDepositLimit: Int!
		singleWithdrawalLimit: Int!
		withdrawalFeeCollectionMethod: String!
		operating: Int! 
		id: String! 
		accountNumber: Int!
		bank: String!
		cardNumber: Int!
		cardHolder: String!
		province: String!
		city: String!
		subBranch: String!
		status: String!
		addTime: DateTime!
		addPerson: String! 
	} 

	#MemberManagement 
	type HierarchyMemberDetailsItem {
		id: Int!
		accountNumber: Int!
		affiliatedAgent: String!
		totalGeneration: String!
		registrationTime: DateTime!
		lastLoginTime: DateTime!
		numberOfDeposits: Int!
		totalDeposit: Int!
		numberOfWithdrawals: Int!
		totalWithdrawal: Int!
		balance: Int!
		isLock: Int! 
	} 

	#OperationalRiskControl
	type NoteManagementItem {
		orderNumber: String!
		memberAccount: String!
		belongLevel: String!
		gameMaker: String!
		gameName: String!
		threePartyOrderNumber: String!
		betTime: DateTime!
		betAmount: Int!
		effectiveBet: Int!
		awardTime: DateTime!
		prizeAmount: Int!
		handlingFee: Int!
		profitAndLoss: Int!
	}

	#OperationalRiskControl
	type FlowAuditItem {
		depositTime: DateTime!
		depositIntoTheWater: Int!
		depositAmount: Int!
		completedAmount: Int!
		depositNeedsToBeAudited: Int!
		administrativeFeeDeduction: Int!
		discountedPrice: Int!
		offerNeedsToBeAudited: Int!
		discountDeduction: Int!
	}

	#OperationalRiskControl
	type MoneyControlConditionManagementItem {
		no: Int!
		condition: Int!
		judge: Int!
		value: Int!
		status: Int!
		delete: Int!
	}

	#OperationalRiskControl
	type MoneyControlAuditItem {
		orderNumber: String!
		memberAccount: String!
		hierarchy: String!
		VIPRating: String!
		withdrawalApplicationTime: DateTime!
		numberOfWithdrawals: Int!
		applicationForWithdrawalAmount: Int!
		accountBalance: Int!
		handlingFee: Int!
		administrativeFee: Int!
		discountDeduction: Int!
		amountOfWithdrawal: Int!
		systemAudit: Int!
		status: Int!
		operator: String!
		operatingTime: DateTime!
		note: Int!
		noteDetails: String!
	}

	#ActivityManagement
	type EventListItem {
		id: Int!
		serialNumber: Int!
		eventName: String!
		company: String!
		typeOfActivity: String!
		activityStartTime: DateTime!
		eventEndTime: DateTime!
		creationTime: DateTime!
		founder: String!
		lastUpdateTime: DateTime!
		updater: String!
		status: String!
		operating: String!
	}

	#ActivityManagement
	type ActivityReviewItem {
		id: Int!
		serialNumber: Int!
		eventName: String!
		company: String!
		accountNumber: Int!
		affiliatedAgent: String!
		rechargeToday: Int!
		effectiveBettingToday: Int!
		applicationTime: DateTime!
		discountedPrice: Int!
		status: String!
		reviewer: String!
		reviewTime: DateTime!
	}

	#AnnouncementManagement
	type SystemNotificationItem {
		serialNumber: Int!
		announcementTitle: String!
		displayForm: String!
		announcementStartDate: DateTime!
		announcementStartTime: DateTime!
		announcementEndDate: DateTime!
		announcementEndTime: DateTime!
		sortWeight: Int!
		addAPerson: String!
		withdrawalAmount: Int!
	}

	type AppPushItem {
		serialNumber: Int!
		pushContent: String!
		pushStartDate: DateTime!
		pushStartTime: DateTime!
		creationTime: DateTime!
	}

	type CopywritingManagementItem {
		serialNumber: Int!
		copyName: String!
		displayPosition: String!
        sortWeight: Int!
        founder: String!
        modifier: String!
        withdrawalAmount: Int!
	}

	type HomeCarouselManagementItem {
		serialNumber: String!
		name: String!
		displayForm: String!
		link: String!
		sortWeight: String!
		addAPerson: String!
		modifier: String!
		lastModified: String!
	}
	type CommissionManagementItem {
		no: Int!
        commissionName: String!
        status: Int!
        statisticalPeriod: Int!
        created: DateTime!
        founder: String!
        lastUpdate: DateTime!
        updater: String!
	}

	type CommissionStatisticsItem {
		date: DateTime!
        userName: String!
        belongsTo: String!
        commissionType: String!
        amount: Int!
        status: Int!,
        operator: String!
		operatingTime: DateTime!
		remarks: String!
	}

	#Electric Sales
	type FirstPaymentVerificationItem {
		orderNumber: String!
		memberAccount: String!
		hierarchy: String!
		VIPRating: String!
		withdrawalApplicationTime: String!
		numberOfWithdrawals: String!
		applicationForWithdrawalAmount: String!
		accountBalance: String!
		handlingFee: String!
		administrativeFee: String!
		discountDeduction: String!
		amountOfWithdrawal: String!
		dialNumber: String!
		status: String!
		operator: String!
		operatingTime: String!
		operating: String!
	}

	#Log Management
	type UserLoginLogItem {
		numbering: Int!
		playerAccount: String!
		affiliatedAgent: String!
		loginTime: String!
		loginIP: String!
		loginUrl: String!
		loginResult: Boolean!
	}
	
	type MemberNewsInboxItem {
		serialNumber: String!
		messageTitle: String!
		messageCategory: String!
		recipient: String!
		sendingTime: String!
		sender: String!
		status: Int!
	}

	type MemberNewsOutboxItem {
		serialNumber: String!
		messageTitle: String!
		messageCategory: String!
		recipient: String!
		sendingTime: String!
		sender: String!
		status: Int!
	}

	#ReportManagement
	type UserReportItem {
		id: Int!
		accountNumber: Int!
		date: DateTime!
		activeUser: Int!
		numberOfBets: Int!
		newUsers: String!
		newUserRecharge: String!
		retainedTheNextDay: String!
		threeDaysOfRetention: String!
		fiveDaysToSurvive: String!
		retainedOnThe7th: String!
		remainingOnThe15thDay: String! 
	}

	#ReportManagement
	type ProfitAndLossDateReportItem { 
		id: Int!
		accountNumber: Int!
		date: DateTime!
		activeUser: Int!
		numberOfBets: Int!
		numberOfPeopleBets: Int!
		betAmount: Int!
		effectiveBet: Int!
		prizeAmount: Int! 
		profitAndLoss: Int! 
	}
	
	#ReportManagement
	type ProfitAndLossStatementsItem { 
		id: Int!
		accountNumber: Int!
		date: DateTime!
		proxyAccount: String!
		affiliatedAgent: String!
		betAmount: Int!
		effectiveBet: Int!
		numberOfBet: Int!
		numberOfPeopleBet: Int!
		prizeAmount: Int! 
		profitAndLoss: Int!  
	}

	#ReportManagement
	type RechargeReportItem { 
		id: Int!
		accountNumber: Int!
		date: DateTime!
		proxyAccount: String!
		affiliatedAgent: String!
		rechargeAmount: Int! 
		numberOfRecharges: Int!
		rechargeNumber: Int!
		topUpOffer: Int!  
		rechargeFee: Int!  
		numerOfWithdrawals: Int!  
		numerOfPeopleWithdrawals: Int! 
		withdrawalAmount: Int!  
		withdrawalFee: Int!
		charge: Int! 
	}


	#ReportManagement
	type AccountChangeReportItem { 
		id: Int!
		accountNumber: Int!
		date: DateTime!
		transactionFlow: String!
		proxyAccount: String!
		affiliatedAgent: String! 
		transactionHour: DateTime!
		transactionType: String! 
		preTransaction: Int!
		theTransactionAccount: Int!
		postTradeAmount: Int!
		transactionNote: String!  
	}

	#ReportManagement
	type RechargeDailyReportItem { 
		id: Int!
		accountNumber: Int!
		date: DateTime!
		rechargeAmount: Int! 
		numberOfRecharges: Int!
		rechargeNumber: Int!
		topUpOffer: Int!
		rechargeFee: Int!
		numberOfWithdrawals: Int!
		numberOfPeopleWithdraw: Int!
		withdrawalAmount: Int!
		withdrawalFee: Int!
		charge: Int!
		rechargeDailyReport: Int!
	}

	#ReportManagement
	type OperationalGeneralReportItem { 
		id: Int!
		accountNumber: Int!
		date: DateTime! 
		totalData: String!  
		proxyData: Int! 
		activeMember: Int! 
		rechargeAmount: Int! 
		numberOfRecharges: Int!
		rechargeNumber: Int!
		withdrawalAmount: Int! 
		numberOfWithdrawal: Int! 
		numberOfPeopleWithdrawal: Int! 
		betAmount: Int! 
		effectiveBet: Int! 
		numberOfBet: Int! 
		numberOfPeopleBets: Int! 
		profitAndLoss: Int! 
		proxyAccount: Int! 
	}
	
	
	type DepositLevel {
		id: String!
		name: String!
	}

	type VIPRating {
		id: String!
		name: String!
	}

	type Query {
		dataAnalysisReport: [DataAnalysisReport]
		summaries: [DataAnalysisSummary]
		barCharts: [Chart]
		doughnutChart: Chart
		recentUserDeviceUsages: [RecentUserDeviceUsage]
		companyDepositAccountsReview: [CompanyDepositReviewItem!]
		accessionOverview: [AccessionOverviewItem!]
		onlineDepositReview: [OnlineDepositReviewItem!]
		paymentReview: [PaymentReviewItem!]!
		companyDepositAccountManagement: [CompanyDepositAccountManagementItem!]
		onlineDepositAccountManagement: [OnlineDepositAccountManagementItem!]
		depositLevels: [DepositLevel]
		vipRatings: [VIPRating]
		manualDepositReview: [ManualDepositReviewItem]
		manualWithdrawalReview: [ManualWithdrawalReviewItem]
		gameManagement: [GameManagementItem]
		liveVideo: [LiveVideoItem]
		chessGame: [GameManagementItem]
		sportsCompetition: [GameManagementItem]
		userManagement: [UserManagementItem]
		memberVIPSystem: [MemberVIPSystemItem]
		userBankCardManagement: [UserBankCardManagementItem]
		memberDepositLevel: [memberDepositLevelItem]
		hierarchyMemberDetails : [HierarchyMemberDetailsItem]
		trialReview: [TrialReviewItem]
		agentManagement: [AgentManagementItem]
		agentReview: [AgentReviewItem]
		userReport: [UserReportItem]
		profitAndLossDateReport: [ProfitAndLossDateReportItem] 
		profitAndLossStatement: [ProfitAndLossStatementsItem]
		rechargeReport: [RechargeReportItem]
		accountChangeReport: [AccountChangeReportItem]
		rechargeDailyReport: [RechargeDailyReportItem]
		noteManagement: [NoteManagementItem]
		flowAudit: [FlowAuditItem]
		moneyControlConditionManagement: [MoneyControlConditionManagementItem]
		moneyControlAudit: [MoneyControlAuditItem]
		systemNotification: [SystemNotificationItem]
		appPush: [AppPushItem]
		copywritingManagement: [CopywritingManagementItem]
		homeCarouselManagement: [HomeCarouselManagementItem]
		memberNewsInbox: [MemberNewsInboxItem]
		memberNewsOutbox: [MemberNewsOutboxItem]
		commissionManagement: [CommissionManagementItem]
		eventList: [EventListItem]
		activityReview: [ActivityReviewItem]
		commissionStatistics: [CommissionStatisticsItem]
		firstPaymentVerification: [FirstPaymentVerificationItem]
		userLoginLog: [UserLoginLogItem]
		operationalGeneralReport: [OperationalGeneralReportItem]
		
	}
	

	type Mutation {
		login(username: String!, password: String!, code: String!): AuthPayload!
	}
`;