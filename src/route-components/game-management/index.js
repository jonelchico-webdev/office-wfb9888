import React from 'react';
import {Route, Switch } from 'react-router-dom';
import ElectronicGames from './electronic-games';
import ESportGames from './esport-games';
import LiveVideo from './live-video';
import {ELECTRONIC_GAMES, LIVE_VIDEO, CHESS_GAME, SPORTS_COMPETITION, ELECTRONIC_GAME_MANAGEMENT, LOTTERY_GAME, ESPORT_GAMES, ESPORT_GAME_MANAGEMENT} from '../../paths';
import ChessGame from './chess-game';
import SportsCompetition from './sports-competition';
import LotteryGame from './lottery-game';
import ElectronicGameManagement from './electronic-games/electronic-game-management';
import ESportGameManagement from './esport-games/esport-game-management';

export default function GameManagement() {
	return <Switch>
		<Route path={ELECTRONIC_GAME_MANAGEMENT} component={ElectronicGameManagement}/>
		<Route path={ELECTRONIC_GAMES} component={ElectronicGames}/>
		<Route path={ESPORT_GAME_MANAGEMENT} component={ESportGameManagement} />
		<Route path={ESPORT_GAMES} component={ESportGames}/>
		<Route path={LIVE_VIDEO} component={LiveVideo}/>
		<Route path={CHESS_GAME} component={ChessGame}/>
		<Route path={SPORTS_COMPETITION} component={SportsCompetition}/>
		<Route path={LOTTERY_GAME} component={LotteryGame} />
	</Switch>
}