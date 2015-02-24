var boardSizes = [9, 16, 25, 36];

var TileGame = React.createClass({
  getDefaultProps: function() {
    boardSizes: [9, 16, 25, 36]
  },
  getInitialState: function() {
    return {
      tiles: [1, 2, 3, 4, 5, 6, 7, 8, null],
      moves: 0,
      secondsElapsed: 0
    }
  },
  numTiles: function() {
    return this.state.tiles.length;
  },
  attemptToMoveTile: function(position) {
    var rowSize = Math.sqrt(this.numTiles());
    if (position % rowSize != 0 && !this.state.tiles[position - 1]) {
      // move tile left
      this.swapTiles(position, position - 1);
    } else if ((position + 1) % rowSize != 0 && !this.state.tiles[position + 1]) {
      // move tile right
      this.swapTiles(position, position + 1);
    } else if (position > (rowSize - 1) && !this.state.tiles[position - rowSize]) {
      // move tile up
      this.swapTiles(position, position - rowSize);
    } else if (position < (this.numTiles() - rowSize) && !this.state.tiles[position + rowSize]) {
      // move tile down
      this.swapTiles(position, position + rowSize);
    }
  },
  swapTiles: function(tilePosition, newPosition) {
    var tiles = this.state.tiles;
    var newTileId = tiles[newPosition];
    tiles[newPosition] = tiles[tilePosition];
    tiles[tilePosition] = newTileId;
    this.setState({ tiles: tiles });
  },
  handleTileClick: function(childComponent) {
    this.attemptToMoveTile(this.state.tiles.indexOf(childComponent.props.id));
    this.setState({ moves: this.state.moves + 1 });
    this.checkCompletion();
  },
  checkCompletion: function() {
    var tiles = [];
    for (i = 1; i < this.state.tiles.length; i++) {
      tiles.push(i);
    }
    tiles.push(null);
    if (_.isEqual(this.state.tiles, tiles)) {
      alert('Winner!');
      this.stopTimer();
    }
  },
  shuffleTiles: function() {
    this.reset();
    for (i = 0; i < 200; i++) {
      var emptyPosition = this.state.tiles.indexOf(null);
      var rowSize = Math.sqrt(this.numTiles());
      possibleMoves = [];
      if ((emptyPosition + 1) % rowSize != 0) {
        possibleMoves.push(emptyPosition + 1);
      }
      if (emptyPosition % rowSize != 0) {
        possibleMoves.push(emptyPosition - 1);
      }
      if (emptyPosition > rowSize) {
        possibleMoves.push(emptyPosition - rowSize);
      }
      if (emptyPosition < this.numTiles() - rowSize) {
        possibleMoves.push(emptyPosition + rowSize);
      }
      this.attemptToMoveTile(_.sample(possibleMoves));
    }
    this.startTimer();
  },
  reset: function() {
    this.setState(this.getInitialState());
    this.stopTimer();
  },
  startTimer: function() {
    this.stopTimer();
    this.timer = setInterval(function() {
      this.setState({ secondsElapsed: this.state.secondsElapsed + 1 })
    }.bind(this), 1000);
  },
  stopTimer: function() {
    clearInterval(this.timer);
  },
  changeBoardSize: function(evt) {
    this.reset();
    var newBoardSize = evt.target.value;
    var tiles = [];
    for (i = 1; i < newBoardSize; i++) {
      tiles.push(i);
    }
    tiles.push(null);
    this.setState({ tiles: tiles });
  },
  render: function() {
    var tileNodes = this.state.tiles.map(function (tileId) {
      return (
        <Tile id={tileId} onClick={this.handleTileClick} />
      );
    }.bind(this));
    var rowSize = Math.sqrt(this.numTiles());
    for (i = rowSize; i < this.numTiles(); i += rowSize + 1) {
      tileNodes.splice(i, 0, <br />);
    }
    var boardSizeOptions = this.props.boardSizes.map(function(item, index) {
      return <option key={index} value={item}>{Math.sqrt(item) + " x " + Math.sqrt(item)}</option>
    });
    return (
      <div>
        <label>Puzzle Size: </label>
        <select onChange={this.changeBoardSize} value={this.state.tiles.length}>{boardSizeOptions}</select>
        <br /><br />
        <div>
          {tileNodes}
        </div>
        <br />
        <div>Time Elapsed: {numeral(this.state.secondsElapsed).format('00:00:00')}</div>
        <div>Moves: {this.state.moves}</div>
        <br />
        <button type="button" onClick={this.shuffleTiles}>Shuffle</button><button type="button" onClick={this.reset}>Reset</button>
      </div>
    );
  }
});

var Tile = React.createClass({
  getDefaultProps: function() {
    return {
      id: ""
    }
  },
  handleClick: function() {
    this.props.onClick(this);
  },
  render: function() {
    var style = {
      height: 100,
      width: 100,
      lineHeight: 3,
      verticalAlign: "middle",
      fontSize: 36,
      fontWeight: "bold",
      display: "inline-block",
      textAlign: "center",
      border: "1px solid"
    };
    return (
      <div onClick={this.handleClick} style={style}>
        {this.props.id || " "}
      </div>
    );
  }
});

React.render(
  <TileGame boardSizes={boardSizes} />,
  document.getElementById("content")
);
