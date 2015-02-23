var TileGame = React.createClass({
  getDefaultProps: function() {
    return {
      numTiles: 9
    }
  },
  getInitialState: function() {
    var tiles = [];
    for (i = 1; i < this.props.numTiles; i++) {
      tiles.push(i);
    }
    tiles.push(null);
    return {
      tiles: tiles,
      moves: 0,
      secondsElapsed: 0
    }
  },
  attemptToMoveTile: function(position) {
    var rowSize = Math.sqrt(this.props.numTiles);
    if (position % rowSize != 0 && !this.state.tiles[position - 1]) {
      // move tile left
      this.swapTiles(position, position - 1);
    } else if ((position + 1) % rowSize != 0 && !this.state.tiles[position + 1]) {
      // move tile right
      this.swapTiles(position, position + 1);
    } else if (position > (rowSize - 1) && !this.state.tiles[position - rowSize]) {
      // move tile up
      this.swapTiles(position, position - rowSize);
    } else if (position < (this.props.numTiles - rowSize) && !this.state.tiles[position + rowSize]) {
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
    if (_.isEqual(this.state.tiles, this.getInitialState().tiles)) {
      alert('Winner!');
      this.stopTimer();
    }
  },
  shuffleTiles: function() {
    this.setState(this.getInitialState());
    for (i = 0; i < 200; i++) {
      var emptyPosition = this.state.tiles.indexOf(null);
      var rowSize = Math.sqrt(this.props.numTiles);
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
      if (emptyPosition < this.props.numTiles - rowSize) {
        possibleMoves.push(emptyPosition + rowSize);
      }
      this.attemptToMoveTile(_.sample(possibleMoves));
    }
    this.startTimer();
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
  render: function() {
    var tileNodes = this.state.tiles.map(function (tileId) {
      return (
        <Tile id={tileId} onClick={this.handleTileClick} />
      );
    }.bind(this));
    var rowSize = Math.sqrt(this.props.numTiles);
    for (i = rowSize; i < this.props.numTiles; i += rowSize + 1) {
      tileNodes.splice(i, 0, <br />);
    }
    console.log(tileNodes);
    return (
      <div>
        <div>
          {tileNodes}
        </div>
        <br />
        <div>Time Elapsed: {numeral(this.state.secondsElapsed).format('00:00:00')}</div>
        <div>Moves: {this.state.moves}</div>
        <br />
        <button type="button" onClick={this.shuffleTiles}>Shuffle</button>
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
  <TileGame numTiles="9" />,
  document.getElementById("content")
);
