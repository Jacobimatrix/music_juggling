import * as React from "react";
import { RouteComponentProps } from "react-router";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/src/styles.scss";
import fs from "fs";
import { RefObject } from "react";
import sendSignalToUsbDevice from "../core/midi";
import { sign } from "crypto";
import getDataTreeFromFile from "../core/readLightDataFromFile";

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
  currentSongLightData;
  lastProcessedTimestamp: number;
  // secs

  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      text: "Open a file to display content here",
    };
    this.currentSongLightData = getDataTreeFromFile();
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

    const newest_keyframe = this.currentSongLightData.le(
      currentTimestampInSong
    );

    if (newest_keyframe && newest_keyframe.key > this.lastProcessedTimestamp) {
      const signalToSend = newest_keyframe.value;
      sendSignalToUsbDevice(signalToSend);
    }
    this.lastProcessedTimestamp = currentTimestampInSong;
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
          src="file:///C:\Users\Jakob Schubert\Desktop\music_juggling\music_lightshow_jahreswechsel_20_21.mp3"
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
