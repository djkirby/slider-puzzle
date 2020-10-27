var TileGame = React.createClass({
  getDefaultProps: function() {
    puzzleSizes: [9, 16, 25, 36]
  },
  getInitialState: function() {
    return {
      tiles: [1, 2, 3, 4, 5, 6, 7, 8, null],
      moves: 0,
      secondsElapsed: 0
    }
  },
  changePuzzleSize: function(puzzleSize) {
    this.reset();
    var tiles = [];
    for (i = 1; i < puzzleSize.size; i++) {
      tiles.push(i);
    }
    tiles.push(null);
    this.setState({ tiles: tiles });
  },
  shuffleTiles: function() {
    var tiles = [];
    for (i = 1; i < this.state.tiles.length; i++) {
      tiles.push(i);
    }
    tiles.push(null);
    var rowSize = Math.sqrt(tiles.length);
    for (i = 0; i < 200; i++) {
      var emptyPosition = tiles.indexOf(null);
      possibleMoves = [];
      if ((emptyPosition + 1) % rowSize != 0) {
        possibleMoves.push(emptyPosition + 1);
      }
      if (emptyPosition % rowSize != 0) {
        possibleMoves.push(emptyPosition - 1);
      }
      if (emptyPosition > rowSize - 1) {
        possibleMoves.push(emptyPosition - rowSize);
      }
      if (emptyPosition < tiles.length - rowSize) {
        possibleMoves.push(emptyPosition + rowSize);
      }
      tiles = this.moveTile(tiles, tiles[_.sample(possibleMoves)]);
    }
    this.setState({ tiles: tiles, moves: 0, secondsElapsed: 0 });
    this.stopTimer();
    this.startTimer();
  },
  handleTileClick: function(id) {
    if (tiles = this.moveTile(this.state.tiles, id)) {
      this.setState({ tiles: tiles, moves: this.state.moves + 1 });
      this.checkCompletion();
    }
  },
  moveTile: function(tiles, id) {
    var position = tiles.indexOf(id);
    var rowSize = Math.sqrt(tiles.length);
    if (position % rowSize != 0 && !tiles[position - 1]) { // move left
      return this.swapTiles(tiles, position, position - 1);
    } else if ((position + 1) % rowSize != 0 && !tiles[position + 1]) { // move right
      return this.swapTiles(tiles, position, position + 1);
    } else if (position > (rowSize - 1) && !tiles[position - rowSize]) { // move up
      return this.swapTiles(tiles, position, position - rowSize);
    } else if (position < (tiles.length - rowSize) && !tiles[position + rowSize]) { // move down
      return this.swapTiles(tiles, position, position + rowSize);
    }
  },
  swapTiles: function(tiles, tilePosition, newPosition) {
    var newTileId = tiles[newPosition];
    tiles[newPosition] = tiles[tilePosition];
    tiles[tilePosition] = newTileId;
    return tiles;
  },
  reset: function(callback) {
    var tiles = [];
    for (i = 1; i < this.state.tiles.length; i++) {
      tiles.push(i);
    }
    tiles.push(null);
    this.setState({ tiles: tiles, moves: 0, secondsElapsed: 0 });
    this.stopTimer();
  },
  startTimer: function() {
    this.stopTimer();
    this._timer = setInterval(function() {
      this.setState({ secondsElapsed: this.state.secondsElapsed + 1 })
    }.bind(this), 1000);
  },
  stopTimer: function() {
    clearInterval(this._timer);
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
  render: function() {
    return (
      <div>
        <PuzzleSizeForm selectedSize={this.state.tiles.length} onPuzzleSizeChange={this.changePuzzleSize} />
        <br />
        <Puzzle tiles={this.state.tiles} onMoveTile={this.handleTileClick} />
        <br />
        <StatsBox secondsElapsed={this.state.secondsElapsed} moves={this.state.moves} />
        <br />
        <ButtonBar onShuffleTiles={this.shuffleTiles} onReset={this.reset} />
      </div>
    );
  }
});

var PuzzleSizeForm = React.createClass({
  getDefaultProps: function() {
    return {
      selectedSize: 9,
      puzzleSizes: [9, 16, 25, 36]
    }
  },
  handleChange: function(e) {
    this.props.onPuzzleSizeChange({ size: e.target.value });
  },
  render: function() {
    var boardSizeOptions = this.props.puzzleSizes.map(function(item, index) {
      return <option key={index} value={item}>{Math.sqrt(item) + " x " + Math.sqrt(item)}</option>
    });
    return (
      <div>
        <label>Puzzle Size: </label>
        <select onChange={this.handleChange} value={this.props.selectedSize}>{boardSizeOptions}</select>
      </div>
    );
  }
});

var Puzzle = React.createClass({
  moveTile: function(tile) {
    this.props.onMoveTile(tile.props.id);
  },
  render: function() {
    var tiles = this.props.tiles;
    var tileNodes = tiles.map(function (tileId) {
      return (
        <Tile id={tileId} onMove={this.moveTile} />
      );
    }.bind(this));
    for (i = Math.sqrt(tiles.length); i < tiles.length; i += Math.sqrt(tiles.length) + 1) {
      tileNodes.splice(i, 0, <br />);
    }
    return (
      <div>
        {tileNodes}
      </div>
    );
  }
});

var StatsBox = React.createClass({
  getDefaultProps: function() {
    return {
      secondsElapsed: 0,
      moves: 0
    }
  },
  render: function() {
    return (
      <div>
        <div>Time Elapsed: {numeral(this.props.secondsElapsed).format('00:00:00')}</div>
        <div>Moves: {this.props.moves}</div>
      </div>
    );
  }
});

var ButtonBar = React.createClass({
  handleShuffleClick: function(e) {
    this.props.onShuffleTiles({});
  },
  handleResetClick: function(e) {
    this.props.onReset({});
  },
  render: function() {
    return (
      <div>
        <button type="button" onClick={this.handleShuffleClick}>Shuffle</button><button type="button" onClick={this.handleResetClick}>Reset</button>
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
  handleClick: function(e) {
    this.props.onMove(this);
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

var puzzleSizes = [9, 16, 25, 36];

React.render(
  <TileGame puzzleSizes={puzzleSizes} />,
  document.getElementById("content")
);

