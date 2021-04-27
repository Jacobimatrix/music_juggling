import * as React from "react";
import { RouteComponentProps } from "react-router";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/src/styles.scss";
import fs from "fs";
import { RefObject } from "react";
import BinarySearchTree from "binary-search-tree";
import sendSignalToUsbDevice from "../core/midi";
import { sign } from "crypto";

interface State {
  text: string;
}

export default class FooView extends React.Component<
  RouteComponentProps,
  State
> {
  fileRef: React.RefObject<HTMLInputElement>;
  interval: NodeJS.Timeout;
  _audioPlayer: RefObject<AudioPlayer>;
  currentSongLightData: BinarySearchTree;
  lastProcessedTimestamp: number;
  // secs

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      text: "Open a file to display content here",
    };
    let BinarySearchTree = require("binary-search-tree").BinarySearchTree;
    this.currentSongLightData = new BinarySearchTree({ unique: true });
    this.currentSongLightData.insert(1, "g");
    this.currentSongLightData.insert(2, "b");
    this.currentSongLightData.insert(2.5, "g");
    this.currentSongLightData.insert(2.8, "w");
    this.currentSongLightData.insert(3.2, "g");
    this.currentSongLightData.insert(10, "y");
    this.fileRef = React.createRef<HTMLInputElement>();
    this._audioPlayer = React.createRef<AudioPlayer>();
    this.interval = setInterval(() => {
      this.checkForNewKeyframes();
    }, 50);
    this.lastProcessedTimestamp = 0;
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  onGotoBarClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("Navigating to Bar view");
    this.props.history.push("/bar");
  };

  onOpenFileClick = () => {
    if (this.fileRef.current) {
      this.fileRef.current.click();
    }
  };

  checkForNewKeyframes() {
    const currentTimestampInSong: number = this._audioPlayer.current?.audio
      .current?.currentTime;

    if (currentTimestampInSong < this.lastProcessedTimestamp) {
      this.lastProcessedTimestamp = -1;
    }

    const relevantKeyframes = this.currentSongLightData.betweenBounds({
      $lte: currentTimestampInSong,
      $gt: this.lastProcessedTimestamp,
    });
    console.log(relevantKeyframes);

    this.lastProcessedTimestamp = currentTimestampInSong;
    if (relevantKeyframes.length == 0) {
      return;
    }

    const signalToSend = relevantKeyframes[relevantKeyframes.length - 1];
    sendSignalToUsbDevice(signalToSend);
  }

  onFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let paths = e.currentTarget.files;

    if (!paths || paths.length < 1) {
      this.setState({ text: "Could not load files..." });
      return;
    }

    let filePath = paths[0].path;

    this.loadFileContentAsync(filePath)
      .then((fileContent) => this.setState({ text: fileContent }))
      .catch((err) => this.setState({ text: err.message }));
  };

  loadFileContentAsync = async (filePath: string): Promise<string> => {
    try {
      let content = await fs.promises.readFile(filePath, { encoding: "utf-8" });
      return content;
    } catch (error) {
      throw error;
    }
  };

  public render() {
    return (
      <div>
        <h3>Audio Player</h3>
        <AudioPlayer
          src="file:///C:/Users/Jakob Schubert/code/music_juggling/music_juggling/src/resources/audio/test_audio.mp3"
          ref={this._audioPlayer}
        />
        <p>{this.state.text}</p>

        <button onClick={this.onOpenFileClick}>Open file...</button>
        <input
          type="file"
          ref={this.fileRef}
          onChange={this.onFileInputChange}
          style={{ display: "none" }}
        />
        <button onClick={this.onGotoBarClick}>Go to Bar</button>
      </div>
    );
  }
}
