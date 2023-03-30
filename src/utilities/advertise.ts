import { ADVERTISE_CONFIG } from "enum/ADVERTISE";

function isShowAdvertise(index: number, theNumberOfCards: number): boolean {
  const freqOfAdvertise = ADVERTISE_CONFIG.FREQUENCY_OF_ADVERTISE;
  if (theNumberOfCards === 0) return false;
  // case : a few cards
  if (theNumberOfCards <= freqOfAdvertise - 1) {
    // case : For last card, return true. otherwise return false
    if (index === theNumberOfCards - 1) return true;
    return false;
  }
  // case : general
  return index % freqOfAdvertise === freqOfAdvertise - 1;
}

export { isShowAdvertise };
