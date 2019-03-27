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

    for(let i = 0; i < 7; i++) {
      const button = document.getElementById(`button${i}`);
      button.addEventListener('click', () => {
        if (this.state.turn === 1) {
          if(this.placeIntoColumn(i, 1)) {
            if(!this.boardFull()) {
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
    const newNode = (board, cutoff) => {
      const node = {
        board,
        cutoff,
        applyAction: (action) => {

        }
      }

      node.actions = board[0].map((col, idx) => {
        if (col === 0) return idx;
        return null;
      }).filter(a => a != null);

      return node;
    }

    new Promise((res, rej) => {
      let column = Math.floor(Math.random() * 7);
      while(!this.placeIntoColumn(column, 2)) {
        column = Math.floor(Math.random() * 7);
      }
      this.setState({ turn: 1});
      res();
    });
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
    console.log(col, gameBoard[0][col]);
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