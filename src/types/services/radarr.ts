export interface RadarrMovie {
  id: number;
  title: string;
  originalTitle: string;
  sortTitle: string;
  sizeOnDisk: number;
  status: string;
  overview: string;
  inCinemas: string;
  physicalRelease: string;
  digitalRelease: string;
  images: RadarrImage[];
  website: string;
  year: number;
  hasFile: boolean;
  monitored: boolean;
  minimumAvailability: string;
  runtime: number;
  tmdbId: number;
  imdbId: string;
  titleSlug: string;
  folder: string;
  certification: string;
  genres: string[];
  tags: number[];
  added: string;
  ratings: {
    votes: number;
    value: number;
  };
  qualityProfileId: number;
  path: string;
}

export interface RadarrImage {
  coverType: string;
  url: string;
  remoteUrl: string;
}

export interface RadarrDiskSpace {
  id: number;
  path: string;
  label: string;
  freeSpace: number;
  totalSpace: number;
}

export interface RadarrQualityProfile {
  id: number;
  name: string;
  upgradeAllowed: boolean;
  cutoff: number;
  items: Array<{
    quality: {
      id: number;
      name: string;
      source: string;
      resolution: number;
    };
    allowed: boolean;
  }>;
}

export interface RadarrRootFolder {
  id: number;
  path: string;
  accessible: boolean;
  freeSpace: number;
  totalSpace: number;
  unmappedFolders: Array<{
    name: string;
    path: string;
  }>;
}

export interface RadarrDownloadClient {
  id: number;
  name: string;
  enable: boolean;
  protocol: string;
  priority: number;
  removeCompletedDownloads: boolean;
  removeFailedDownloads: boolean;
  fields: Array<{
    name: string;
    value: string;
  }>;
}

export interface RadarrSystemStatus {
  version: string;
  buildTime: string;
  isDebug: boolean;
  isProduction: boolean;
  isAdmin: boolean;
  isUserInteractive: boolean;
  startupPath: string;
  appData: string;
  osName: string;
  osVersion: string;
  isMonoRuntime: boolean;
  isMono: boolean;
  isLinux: boolean;
  isOsx: boolean;
  isWindows: boolean;
  branch: string;
  authentication: string;
  sqliteVersion: string;
  urlBase: string;
  runtimeVersion: string;
  runtimeName: string;
}

export interface RadarrMovieFile {
  id: number;
  movieId: number;
  relativePath: string;
  path: string;
  size: number;
  dateAdded: string;
  sceneName: string;
  quality: {
    quality: {
      id: number;
      name: string;
      source: string;
      resolution: number;
    };
    revision: {
      version: number;
      real: number;
    };
  };
  mediaInfo: {
    audioChannels: number;
    audioCodec: string;
    videoCodec: string;
    videoFps: number;
    resolution: string;
    runTime: string;
    scanType: string;
    subtitles: string[];
  };
}