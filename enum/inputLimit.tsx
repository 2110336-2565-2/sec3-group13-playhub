export enum CHAR_LIMIT {
  MIN_PASSWORD = 6,

  MIN_DISPLAY_NAME = 1,
  MAX_DISPLAY_NAME = 100,

  MIN_DESCRIPTION = 0,
  MAX_DESCRIPTION = 1000,

  MIN_TITLE = 1,
  MAX_TITLE = 500,
}

export enum TAG_LIMIT {
  MIN_TAG = 1,
  MAX_TAG = 5,
}

export enum IMAGE_LIMIT {
  MIN_IMAGE = 0,
  MAX_IMAGE = 3,

  // 1MB = 1_000_000 bytes
  MAX_IMAGE_SIZE = 1_000_000,

  // testing : 30KB = 30_000
  // MAX_IMAGE_SIZE = 30_000,
}
