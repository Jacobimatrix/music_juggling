export default function sendSignalToUsbDevice(
  remoteControlButton: string
): void {
  const signal = getIntToSend(remoteControlButton);
  let navigator = require("jzz");
  navigator.requestMIDIAccess().then(function (midi) {
    let elements = Array.from(midi.outputs.values());
    elements.map((e) => {
      if (e.name.includes("K8")) {
        e.send([144, signal, 100]);
      }
      console.log(`Sending signal ${remoteControlButton}`);
    });
  });
  navigator.close();
}

function getIntToSend(remoteControlButton: string): number {
  switch (remoteControlButton) {
    case "g":
      return 54;

    case "r":
      return 55;

    case "b":
      return 56;

    case "y":
      return 57;

    case "c":
      return 58;

    case "m":
      return 59;

    case "w":
      return 60;

    case " ": // stop
      return 73;

    case "o": // off
      return 53;

    case "1":
      return 63;

    case "2":
      return 64;

    case "3":
      return 65;

    case "4":
      return 66;

    case "5":
      return 67;

    case "6": // ch1
      return 71;

    case "7": //ch2
      return 72;

    case "8": // -
      return 50;

    case "9": // +
      return 51;

    case "f":
      return 61;

    case "z":
      return 48;

    case "0":
      return 52;

    case "x": // Wifi
      return 49;

    case "d":
      return 68;

    case "Enter": // Rec
      return 69;

    case "p":
      return 70;

    case "a": // self-accelerate
      return 62;

    case "h":
      return 74;

    case "j":
      return 75;

    case "k":
      return 76;

    case "l":
      return 77;
    default:
      return 55;
  }
}
