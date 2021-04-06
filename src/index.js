import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


function Square(props) {
	return (
		<button className={`square ${props.highlight?"highlight":null}`}
			onClick={props.onClick}>
			{props.value}
		</button>
	)
}

class Board extends React.Component {
	renderSquare(i) {
		return (<Square key={i} 
						value={this.props.squares[i]}
						highlight={this.props.winner && this.props.winner.indexOf(i)!==-1?true:false}
						onClick={()=>this.props.onClick(i)}
		/>)
	}

	render() {
		const board = Array(3).fill(null).map((line, i)=>{
			return (
				<div className="board-row" key={i}>
					{
						Array(3).fill(null).map((item, j)=>{
							return this.renderSquare(i * 3 + j)
						})
					}
				</div>
			)
		});

		return (
			<div>
				{board}
			</div>
		);
	}
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return [a, b, c];
		}
	}
	return null;
}


class Game extends React.Component {
	constructor(props) {
		super(props)
		this.state = {
			history: [{
				squares: Array(9).fill(null)
			}],
			currClick: [null, null],
			stepNumber: 0,
			isX: true,
			asc: true
		}
	}

	handleClick(i) {
		const history = this.state.history.slice(0, this.state.stepNumber + 1);
		const current = history[history.length-1];
		const squares = current.squares.slice();
		if (calculateWinner(squares) || squares[i]){
			return;
		}

		squares[i] = this.state.isX ? "X" : "O";
		this.setState({
			history: history.concat([{
				squares: squares,
				currClick: [parseInt(i / 3) + 1, i % 3 + 1]
			}]),
			stepNumber: history.length,
			isX: !this.state.isX
		})
	}

	jumpTo(step){
		this.setState({
			stepNumber: step,
			isX: (step % 2) === 0,
			// history: this.state.history.slice(0, step+1)
		})
	}

	handleAsc(){
		this.setState({
			asc: !this.state.asc
		})
	}


	render() {
		const asc = this.state.asc
		const history = this.state.history;
		const current = history[this.state.stepNumber];
		const winner = calculateWinner(current.squares);

		const moves = history.map((step, move)=>{ 
			const currPoint = asc?move: history.length - 1 - move;
			const desc = currPoint ?
				`Go to move # (${history[currPoint].currClick})`:
				`Go to game start`;
			return (
				<li key={currPoint}>
					<button onClick={()=>this.jumpTo(currPoint)} 
							className={`${this.state.stepNumber===currPoint?'bold-item':null}`}>
						{desc}
					</button>
				</li>
			)
		})

		let status;
		
		if (winner){
			status = `Winner: ${current.squares[winner[0]]}`;
		}else if (history.length === 10){
			status = "draw"	
		}
		else{
			status = `Next player: ${this.state.isX?"X":"O"}`;
		}

		return (
			<div className="game">
				<div className="game-board">
					<Board squares={current.squares}
						winner={winner}
						onClick={(i) => this.handleClick(i)}
					/>
				</div>
				<div className="game-info">
					<div>{status}</div>
					<button onClick={()=>this.handleAsc()}
					>{this.state.asc?"Ascending":"Descending"}</button>
					<ol>{moves}</ol>
				</div>
			</div>
		);
	}
}

ReactDOM.render(
	<Game />,
	document.getElementById('root')
)