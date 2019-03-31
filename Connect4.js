class Connect4 {
  constructor() {
    this.state = {
      gameBoard: [
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0],
      ],
      turn: 1
    }

    this.matches = [];

    const temp = [];
    temp.length = 4;
    temp.fill('0');
    const empty = temp.join('');

    for(let i = 1; i < Math.pow(2, 4); i++) {
      const bin = (i >>> 0).toString(2);
      const binary = (empty + bin).substring(bin.length);
      this.matches.push(binary);
    }
    this.matches.reverse();

    for(let i = 0; i < 7; i++) {
      const button = document.getElementById(`button${i}`);
      button.addEventListener('click', () => {
        if (this.state.turn === 1) {
          if(this.placeIntoColumn(i, 1)) {
            if(!this.winCheck(this.state.gameBoard, 1)) {
              if(!this.boardFull()) {
                this.setState({ turn: 2});
                this.agentTurn();
              } else {
                console.log('draw game');
              }
            } else {
              console.log('you win');
            }
          }
        }
      });
    }
    this.render();
  }

  getLines(board) {
    const height = board.length;
    const width = board[0].length;

    const lines = [ ...board ];
    for(let i = 0; i < width; i++) {
      const temp = [];
      for(let j = 0; j < height; j++) {
        temp.push(board[j][i]);
      }
      lines.push(temp);
    }

    for(let i = 0; i < 2; i++) {
      let row = i, col = 0, line = [];  
      while(col < width && row < height) {
        line.push(board[row++][col++]);
      }
      lines.push(line);
      row = i, col = width - 1, line = [];
      while(col > -1 && row < height) {
        line.push(board[row++][col--]);
      }
      lines.push(line);
    }

    for(let i = 1; i < 4; i++) {
      let row = 0, col = i, line = [];
      while(col < width && row < height) {
        line.push(board[row++][col++]);
      }
      lines.push(line);
      row = 0, col = (width - 1) - i, line = [];
      while(col > -1 && row < height) {
        line.push(board[row++][col--]);
      }
      lines.push(line);
    }

    return lines;
  }

  winCheck(board, num) {
    let temp = [];
    temp.length = 4;
    temp = temp.fill(`${num}`).join('');
    return this.getLines(board).map(line => line.join('')).filter(line => line.includes(temp)).length;
    }

  boardFull() {
    const { gameBoard } = this.state;
    let rowCheck = gameBoard.filter((row) => {
      let colCheck = row.filter((col) => {
        if (col === 0)  return true;
        return false;
      });
      if (colCheck.length > 0) return true;
      return false;
    });

    if (rowCheck.length > 0) return false;
    return true;
  }

  getScore(lines, num) {
    let tokens = [];
    lines.forEach(line => {
      let temp = line.split(`${num}`);
      temp.forEach(token => tokens.push(token))
    });
    tokens = tokens.filter(token => token.length > 3).map(token => {
      const reg = num === 1 ? /2/g : /1/g;
      let t = token.replace(reg, '1');
      return t;
    }).filter(token => token.includes('1'));
    let score = 0;
    tokens.forEach(token => {
      this.matches.forEach(match => {
        let idx = 1;
        while(idx != -1) {
          idx = token.indexOf(match);
          if (idx != -1) {
            let count = 0;
            for(let i = idx; i < token.length; i++) {
              count += parseInt(token.charAt(i));
            }
            token = token.replace(match, '0000');
            score += count * count * count * count;
          }
        }
      });
    });
    return score;
  }

  evaluate(board) {
    const lines = this.getLines(board).map(line => line.join(''));
    const playerScore = this.getScore(lines, 2);
    const agentScore = this.getScore(lines, 1);
    // console.log(playerScore, agentScore);
    return agentScore - playerScore;
  }

  agentTurn() {
    const { gameBoard } = this.state;
    const depthLimit = 5;
    const newNode = (board, cutoff) => {
      const node = {
        board: [ ...board],
        cutoff,
        applyAction: (action, num) => {
          const newBoard = this.insertPiece(board, action, num);
          return newNode(newBoard, cutoff - 1);
        }
      }

      node.actions = board[0].map((col, idx) => {
        if (col === 0) return idx;
        return null;
      }).filter(a => a != null);

      return node;
    }

    const minVal = (node, curAlpha, curBeta) => {
      if (node.cutoff == 0 || this.winCheck(node.board, 1) || this.winCheck(node.board, 2)) { // add check for win
        return this.evaluate(node.board);
      }

      node.actions.forEach((action) => {
        curBeta = Math.min(curBeta, maxVal(node.applyAction(action, 1), curAlpha, curBeta));
        if (curAlpha >= curBeta) {
          return curBeta;
        }
      });
      return curBeta;
    }

    const maxVal = (node, curAlpha, curBeta) => {
      if (node.cutoff == 0 || this.winCheck(node.board, 1) || this.winCheck(node.board, 2)) { // add check for win
        return this.evaluate(node.board);
      }
      
      node.actions.forEach((action) => {
        curAlpha = Math.max(curAlpha, minVal(node.applyAction(action, 2), curAlpha, curBeta));
        if (curAlpha >= curBeta) {
          return curAlpha;
        }
      });
      return curAlpha;
    }

    const nextMove = () => {
      let alpha = Number.MIN_SAFE_INTEGER;
      let alphaPrime = alpha;
      let beta = Number.MAX_SAFE_INTEGER;
      let nextAction = -1

      const firstNode = newNode(gameBoard, depthLimit);
      // console.log(firstNode.actions);
      firstNode.actions.forEach((action) => {
        // console.log("column: " + action);
        alphaPrime = minVal(firstNode.applyAction(action, 2), alpha, beta);
        if (alphaPrime > alpha) {
          alpha = alphaPrime;
          nextAction = action;
        }
      });

      return nextAction;
    }

    const move = nextMove();
    if (move == -1) {
      let column = Math.floor(Math.random() * 7);
      while(!this.placeIntoColumn(column, 2)) {
        column = Math.floor(Math.random() * 7);
      }
    } else {
      this.placeIntoColumn(move, 2);
    }

    if(!this.winCheck(this.state.gameBoard, 2)) {
      if(!this.boardFull()) {
        this.setState({ turn: 1});
      } else {
        console.log('draw game');
      }
    } else {
      console.log('you lose');
    }
  }

  insertPiece(gameBoard, col, num) {
    let lowestRow = -1;
    const newGameBoard = gameBoard.map((row, ridx) => {
      return row.map((c, cidx) => {
        if (cidx === col && c === 0) lowestRow = ridx;
        return c;
      });
    });
    newGameBoard[lowestRow][col] = num;
    return newGameBoard;
  }

  placeIntoColumn(col, num) {
    const { gameBoard } = this.state;
    if (gameBoard[0][col] != 0) return false;
    const newGameBoard = this.insertPiece(gameBoard, col, num);
    this.setState({
      gameBoard: newGameBoard
    });
    return true;
  }

  setState(newState) {
    Object.assign(this.state, newState);
    this.render();
  }

  render() {
    const { gameBoard } =  this.state;
    gameBoard.forEach((row, ridx) => {
      row.forEach((col, cidx) => {
        let pos = document.getElementById(`${ridx}${cidx}`);
        if (pos) {
          pos.classList.remove('empty');
          pos.classList.add(`color${col}`);
        }
      });
    });
  }

  static main() {
    return new Connect4();
  }
}

const game = Connect4.main();
