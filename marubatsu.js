

const patterns = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[2, 4, 6]
];

class Panel {
	constructor(game) {
		this.game = game;
		this.message = document.getElementById('message');
		this.li = document.createElement('li');
		this.li.addEventListener('click', () => {
			// すでに押されている場合にもう一度押しても処理しないようにする
			if(this.li.classList.contains('selected') === true) {
				return;
			}
			// ゲームが終了した後にパネルを押せないようにする
			if(this.game.getFinished() === true) {
				return;
			}
			
			this.marubatsuDicide();
			this.game.winnerMessage();
			
		});
	}
	// 「○」・「×」の表示処理
	marubatsuDicide() {
		if(this.game.getOrderNumber() === 0) {
			if(this.game.getClickCount() % 2 === 0) {
				this.ringProcessing();
			} else {
				this.crossProcessing();
			}
		} else {
			if(this.game.getClickCount() % 2 === 0) {
				this.crossProcessing();
			} else {
				this.ringProcessing();
			}
		}
		this.game.addClickCount();
	}
	// 「○」の表示処理
	ringProcessing() {
		this.li.textContent = '○';
		this.li.classList.add('ring', 'selected');
	};
	// 「×」の表示処理
	crossProcessing() {
		this.li.textContent = '×';
		this.li.classList.add('cross', 'selected');
	};
	// liオブジェクトを返す
	getLi() {
		return this.li;
	};
}

class Game {
	constructor() {
		this.level = 3; // 行と列のそれぞれの数
		this.clickCount = 0; // クリックした回数
		this.finished = false; // ゲームが終了したかどうか
		const board = document.getElementById('board');
		this.panels = [];
		this.orderDicide();
		this.setup();
		
		this.restartBtn = document.getElementById('restart');
		// resetボタンを押した時の挙動
		this.restartBtn.addEventListener('click', () => {
			if(this.restartBtn.classList.contains('playing') === true) {
				return;
			}
			// パネルを一度削除する
			while(board.firstChild) {
				board.removeChild(board.firstChild);
			}
			this.reset();
		});
	}
	// 先攻後攻を決める
	orderDicide() {
		this.orderNumber = Math.floor(Math.random() * 2);
		const order1 = document.getElementById('order1');
		const order2 = document.getElementById('order2');

		if(this.orderNumber === 0) {
			order1.classList.remove('earlier', 'later');
			order2.classList.remove('earlier', 'later');
			message.textContent = '「player1」が先攻です';
			order1.textContent = '先攻';
			order2.textContent = '後攻';
			order1.classList.add('earlier');
			order2.classList.add('later');
		} else {
			order1.classList.remove('earlier', 'later');
			order2.classList.remove('earlier', 'later');
			message.textContent = '「player2」が先攻です';
			order1.textContent = '後攻';
			order2.textContent = '先攻';
			order1.classList.add('later');
			order2.classList.add('earlier');
		}
	}
	// パネルをセットする
	setup() { 
		for (let i = 0; i < this.level ** 2; i++) {
			this.panels.push(new Panel(this));
		}
		this.panels.forEach(panel => {
			board.appendChild(panel.getLi());
		});
	}
	// リセットする
	reset() {
		this.panels = [];
		this.orderDicide();
		this.setup();
		this.restartBtn.classList.add('playing');
		this.finished = false;
		this.clickCount = 0;
	}
	// 正誤判定
	lineCheck() {
		let completed = false;
		let lastMarubatsu = '';
		for (let i = 0; i < patterns.length; i++) {
			let panel1 = this.panels[patterns[i][0]].getLi().textContent;
			let panel2 = this.panels[patterns[i][1]].getLi().textContent;
			let panel3 = this.panels[patterns[i][2]].getLi().textContent;
			
			if(panel1 === panel2 && panel2 === panel3 && panel1 !== '') {
				completed = true;
				lastMarubatsu = panel1;
				break;
			}
		}
		return [completed, lastMarubatsu];
	}
	// 勝敗のメッセージを決める
	winnerMessage() {
		if(this.lineCheck()[0] === true) {
			this.finished = true;
			this.restartBtn.classList.remove('playing');
			if(this.lineCheck()[1] === '○') {
				message.textContent = '「player1」の勝ち';
			} else {
				message.textContent = '「player2」の勝ち';
			}
		} else {
			if(this.clickCount === this.level ** 2) {
				message.textContent = '引き分け';
				this.restartBtn.classList.remove('playing');
			}
		}
	}

	getOrderNumber() {
		return this.orderNumber;
	}

	getClickCount() {
		return this.clickCount;
	}

	addClickCount() {
		this.clickCount++;
	}

	getFinished() {
		return this.finished;
	}
}


new Game();
