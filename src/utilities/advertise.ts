import { ADVERTISE_CONFIG } from "enum/ADVERTISE";

const freqOfAdvertise = ADVERTISE_CONFIG.FREQUENCY_OF_ADVERTISE;

function isShowAdvertise(index: number, theNumberOfCards: number): boolean {
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

function selectAdvertise(index: number, advertiseLength: number): number {
  return Math.floor(index / freqOfAdvertise) % advertiseLength;
}

export { isShowAdvertise, selectAdvertise };
