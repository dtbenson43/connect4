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
      turn: 1,
      fuckingwow: 'unfuckingbelieveable'
    }

    this.matches = [];

    const temp = [];
    temp.length = 7;
    temp.fill('0');
    const empty = temp.join('');

    for(let i = 0; i < Math.pow(2, 7); i++) {
      const bin = (i >>> 0).toString(2);
      const binary = (empty + bin).substring(bin.length);
      this.matches.push(binary);
    }
    this.matches.reverse();

    console.log(this.matches);

    for(let i = 0; i < 7; i++) {
      const button = document.getElementById(`button${i}`);
      button.addEventListener('click', () => {
        if (this.state.turn === 1) {
          if(this.placeIntoColumn(i, 1)) {
            if(!this.boardFull()) {
              this.getColRowDiag(this.state.gameBoard);
              this.setState({ turn: 2});
              this.agentTurn();
            } else {
              console.log('gameover');
            }
          }
        }
      });
    }
    this.render();
  }

  getColRowDiag(board) {
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

    start = 6;
    left = true;
    for(let i = 0; i < 11; i++) {
      const temp = [];
      for(let j = start; j < width; j++) {
        temp.push(gameBoard)
      }
    }

    console.log(lines);
  }

  winCheck(num) {

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

  agentTurn() {
    const { gameBoard } = this.state;
    const depthLimit = 5;
    const newNode = (board, cutoff) => {
      const node = {
        board: [ ...board],
        cutoff,
        applyAction: (action) => {
          const newBoard = this.insertPiece(board, action, 2);
          return newNode(newBoard, cutoff - 1);
        }
      }

      node.actions = board[0].map((col, idx) => {
        if (col === 0) return idx;
        return null;
      }).filter(a => a != null);

      return node;
    }

    const evaluate = (board) => {
      return Math.floor(Math.random() * 100);
    }

    const minVal = (node, curAlpha, curBeta) => {
      if (node.cutoff == 0) { // add check for win
        return evaluate(node.board);
      }

      node.actions.forEach((action) => {
        curBeta = Math.min(curBeta, maxVal(node.applyAction(action), curAlpha, curBeta));
        if (curAlpha >= curBeta) {
          return curBeta;
        }
      });
      return curBeta;
    }

    const maxVal = (node, curAlpha, curBeta) => {
      if (node.cutoff == 0) { // add check for win
        return evaluate(node.board);
      }
      
      node.actions.forEach((action) => {
        curBeta = Math.max(curAlpha, minVal(node.applyAction(action), curAlpha, curBeta));
        if (curAlpha >= curBeta) {
          return curBeta;
        }
      });
      return curBeta;
    }

    const nextMove = () => {
      let alpha = Number.MIN_SAFE_INTEGER;
      let alphaPrime = alpha;
      let beta = Number.MAX_SAFE_INTEGER;
      let nextAction = -1

      const firstNode = newNode(gameBoard, depthLimit);
      firstNode.actions.forEach((action) => {
        alphaPrime = minVal(firstNode.applyAction(action), alpha, beta);
        if (alphaPrime > alpha) {
          alpha = alphaPrime;
          nextAction = action;
        }
      });

      return nextAction;
    }

    console.log(nextMove());

    const prom = new Promise((res, rej) => {
      let column = Math.floor(Math.random() * 7);
      while(!this.placeIntoColumn(column, 2)) {
        column = Math.floor(Math.random() * 7);
      }
      res();
    });
    prom.then(() => {
      this.setState({ turn: 1});
    });
    console.log('hello');
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
    // let html = `<table style="width:100%; height:100%">`;
    // gameBoard.forEach((row) => {
    //   html = `${html}<thead>`
    //   html = `${html}<tr>`;
    //   row.forEach((col, idx) => {
    //     html = `${html}
    //     <td>
    //       <div class="color${col}">${idx}</div>
    //     </td>`
    //   });
    //   html = `${html}</tr>`;
    // });
    // html = `${html}</tbody></table>`;
    // console.log(html);
    // this.root.innerHTML = html;
  }

  static main() {
    const game = new Connect4();
  }
}

Connect4.main();
